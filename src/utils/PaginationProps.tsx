import React from "react";
import ReactPaginate from "react-paginate";
import "../layout/css/pagination.css";
import left_arrow from "../layout/image/arrow-left-circle.svg";
import right_arrow from "../layout/image/arrow-right-circle.svg";
interface PaginationProps {
    pageCount: number;
    onPageChange: (selectedItem: { selected: number }) => void; // Callback für Seitenwechsel
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            //previousLabel={<span style={{ fontSize: "24px", padding: "10px" }}>{"<"}</span>}
            //nextLabel={<span style={{ fontSize: "24px", padding: "10px" }}>{">"}</span>}
            previousLabel={
                <img
                    src={left_arrow} // Pfad zum Bild für "zurück"
                    alt="Previous"
                    style={{ width: "20px", height: "20px", margin: "0.5rem" }} // Größe des Icons
                />
            }
            nextLabel={
                <img
                    src={right_arrow} // Pfad zum Bild für "vorwärts"
                    alt="Next"
                    style={{ width: "20px", height: "20px", margin: "0.5rem" }} // Größe des Icons
                />
            }
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            disabledClassName={"disabled"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
        />
    );
};

export default Pagination;
