"use client";
import React, { useRef, forwardRef } from "react";
import { useReactToPrint } from "react-to-print";

// ✅ Use forwardRef correctly
const PrintableContent = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="w-[1000px] p-5 mx-auto bg-white">
      <h1 className="text-2xl font-bold text-center">Your CV Content Here</h1>
      <p className="text-lg text-red-700">
        This is a sample content for printing.
      </p>
    </div>
  );
});

PrintableContent.displayName = "PrintableContent";

const Hellow = () => {
  const printRef = useRef(null);

  // ✅ Use `contentRef` instead of `content`
  const reactToPrintFn = useReactToPrint({ contentRef: printRef });

  return (
    <div>
      <button
        onClick={reactToPrintFn}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Print
      </button>

      {/* ✅ Attach the ref correctly */}
      <PrintableContent ref={printRef} />
    </div>
  );
};

export default Hellow;