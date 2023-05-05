import Hero from "../components/Hero";
import MainNavbar from "../components/MainNavbar";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../reducers/productSlice";
import { useSelector } from "react-redux";

function Home() {
  const [currPage, setCurrPage] = useState(1);
  const [filter, setFilter] = useState({ name: "", sort: "", price: "" });
  // totalPages, products
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((f) => {
      return {
        ...f,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const { name, sort, price } = filter;
    let query = "?";
    if (currPage) query += `page=${currPage}`;
    if (name) query += `&name=${name}`;
    if (sort) query += `&sort=${sort}`;
    if (price) query += `&price=${price}`;
    dispatch(fetchProducts(query));
  }, [currPage, filter.sort, filter.price]);

  /** If total pages changed, set current page to page 1
   * !FIXME:
   * * What I don't like about this is if say 2 different queries have the same total products
   * * thus, this `useEffect` won't be run and the current page won't be back to page 1.
   * * But if I set current page every time products have changed, the pagination won't work
   * * because it always set to page 1
   */
  useEffect(() => {
    setCurrPage(1);
  }, [product.totalPages]);

  return (
    <>
      <MainNavbar filterName={filter.name} onChange={handleChange} />
      <Hero
        onChange={handleChange}
        currPage={currPage}
        setCurrPage={setCurrPage}
        product={product}
      />
    </>
  );
}

export default Home;
