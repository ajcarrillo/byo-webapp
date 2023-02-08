import React, { useCallback, useEffect, useState } from "react";

import './Pagination.css';

interface IPaginationProps {
  datasetName: string;
  totalRecords: number;
  itemsPerPage: number;
  pagesPerGroup: number;
  callbackPageLoad: Function;
};

const Pagination: React.FC<IPaginationProps> = (props: IPaginationProps) => {
  const { datasetName, totalRecords, itemsPerPage, pagesPerGroup, callbackPageLoad } = props;

  const [dataset, setDataset] = useState(datasetName);
  const [pageButtons, setPageButtons] = useState<any>([]);
  const [pageGroup, setPageGroup] = useState(0);
  const [page, setPage] = useState(0);

  /**
   * If dataset changes, then reset page to 0
   */
  useEffect(() => {
    if(dataset !== datasetName){
      setDataset(datasetName);
      setPage(0);
      setPageGroup(0)
    }
  }, [dataset, datasetName]);

  /**
   * 
   */
  const selectPage = useCallback((pageNum: number, rowStart: string) => {
    if(pageNum === page) return;
    
    setPage(pageNum);
    callbackPageLoad(rowStart);
  }, [callbackPageLoad, page]);

  /**
   * Create all page buttons
   */
  useEffect(() => {
    const pageCount = Math.ceil(Number(totalRecords) / Number(itemsPerPage));
    let pages: any = [];
    let start = 0;
    for(let c = 0; c < pageCount; c++){
      pages[c] = <span className="Pagination-page-button" key={`pagination-page-${start}`}>
        <button 
          className={c === page ? 'Button-text-selected' : 'Button-text'}
          data-start={String(start)} 
          data-pagenum={Number(c)} 
          onClick={(e) => selectPage(Number(e.currentTarget.dataset.pagenum), String(e.currentTarget.dataset.start))} 
          title={`Page ${c + 1}`}
        >
          {c + 1}
        </button>
      </span>;
      start += Number(itemsPerPage);
    }
    setPageButtons(pages);
  },[itemsPerPage, page, selectPage, totalRecords]);

  /**
   * 
   * @param direction 
   */
  const changePageGroup = (direction: string) => {
    let group;
    if(direction === 'next'){
      group = pageGroup + pagesPerGroup;
      if(group >= pageButtons.length) group = pageGroup;
    }else{
      group = pageGroup - pagesPerGroup;
      if(group < 0) group = 0;
    }
    setPageGroup(group);
  }

  return (
    <div style={{display: 'flex'}}>
      {pageButtons.length > pagesPerGroup && (
        <div style={{marginRight: '.6rem'}}><button title="Previous page group" className="Button-icon-small" onClick={() => changePageGroup('prev')}><i className="fa-solid fa-angles-left"></i></button></div>
      )}
      <div>{pageButtons.slice(pageGroup, pageGroup+pagesPerGroup)}</div>
      {pageButtons.length > pagesPerGroup && (
        <div style={{marginLeft: '.6rem'}}><button title="Next page group" className="Button-icon-small" onClick={() => changePageGroup('next')}><i className="fa-solid fa-angles-right"></i></button></div>
      )}
    </div>
  );
};

export default Pagination;