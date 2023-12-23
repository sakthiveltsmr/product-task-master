import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";
import ReactPaginate from "react-paginate";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit,setLimit]=useState(20);
  const [total,setTotal]=useState(0)
  // const cardsPerPage = 20;
  // const totalProducts = 100;
   
  const searchData=async(data)=>{
    try {
      await fetch(`https://dummyjson.com/products/search?q=${data}`)
.then(res => res.json())
.then((res)=>setProducts(res.products));
    } catch (error) {
      console.log(error,"failed to fetch the data")
    }
  }


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Calculate skip and limit based on current page and cards per page
        const skip = (currentPage - 1) * limit;
        // const limit = cardsPerPage;

        const response = await fetch(
          `https://dummyjson.com/products?skip=${skip}&limit=${limit}`
        );
        if (response.ok) {
          const data = await response.json();

          if (data.products && Array.isArray(data.products)) {
            setProducts(data.products);;
            setLimit(data.limit);
            setTotal(data.total);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Error fetching products:", response.status);
        }
      } catch (error) {
        console.error("Error during product fetch:", error);
      }
    };

    fetchProducts();
  }, [currentPage,limit]); // Include currentPage as a dependency

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className=" bg-blue-gray-400">
      <Navbar searchData={searchData}/>
      <div className="flex flex-wrap justify-center">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <ReactPaginate
        pageCount={Math.ceil(total / limit)}
        pageRangeDisplayed={5} // Display 5 page numbers in the pagination
        marginPagesDisplayed={2} // Display 2 page numbers as margin
        onPageChange={handlePageChange}
        activeClassName="bg-black text-white"
        previousClassName="py-2 px-4  text-black rounded-md mr-3 border  border-gray-800"
        nextClassName="py-2 px-4  text-black rounded-md ml-3 border  border-gray-800"
        containerClassName="flex mt-8 pb-8 items-center justify-center"
        pageClassName="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-xl mr-3 text-sm"
        breakClassName="w-10 h-10 flex items-center justify-center text-gray-700"
      />
    </div>
  );
};

export default Homepage;
