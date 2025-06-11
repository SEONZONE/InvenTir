"use client";

import { useState, useEffect } from "react";
import SelectDropdown from "@/src/component/ui/SelectDropDown";
import { CommonInput } from "@/src/component/ui/InputComponents";

export default function MaterialTable() {
  const [selectCategory, setSelectCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice1, setUnitPrice1] = useState(0);
  const [unitPrice2, setUnitPrice2] = useState(0);
  const [unitPrice3, setUnitPrice3] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [items, setItems] = useState([]);
  const [categoryProcess, setCategoryProcess] = useState([]);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handlerCategoryChange = (e) => {
    const selectedProcess = e.target.value;
    setSelectCategory(selectedProcess);
    setSelectedSubCategory("");

    let filtered = categoryProduct.filter(
      (item) => item.step1 === selectedProcess
    );
    setFilteredProducts(filtered);
    filtered = null;
  };

  const handleSubCategoryChange = (e) => {
    let filtered = categoryProduct.filter(
      (item) => item.id === parseInt(e.target.value)
    );
    setSelectedSubCategory(filtered[0].unit);
    setSelectedUnit(filtered[0].unit);
  };

  const handleUnitPriceChange1 = (e) => {
    setUnitPrice1(parseInt(e.target.value) || 0);
  };

  const handleUnitPriceChange2 = (e) => {
    setUnitPrice2(parseInt(e.target.value) || 0);
  };

  const handleUnitPriceChange3 = (e) => {
    setUnitPrice3(parseInt(e.target.value) || 0);
  };

  const getTotalPrice = () => {
    return (
      quantity * unitPrice1 + quantity * unitPrice2 + quantity * unitPrice3 || 0
    );
  };

  const addItem = () => {
    if (!selectCategory || !selectedSubCategory || !selectedUnit) {
      alert("모든 필드를 선택해 주세요");
      return;
    }

    const newItem = {
      id: Date.now(),
      category: selectCategory,
      subCategory: selectedSubCategory,
      unit: selectedUnit,
      quantity: quantity,
      unitPrice1: unitPrice1,
      unitPrice2: unitPrice2,
      unitPrice3: unitPrice3,
      totalPrice: getTotalPrice(),
    };

    setItems([...items, newItem]);

    // 초기화
    setSelectCategory("");
    setSelectedSubCategory("");
    setSelectedUnit("");
    setQuantity(0);
    setUnitPrice1(0);
    setUnitPrice2(0);
    setUnitPrice3(0);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const loadCategory = async () => {
    try {
      const prcoess = await fetch("/api/categoryCode?type=process");
      const processJson = await prcoess.json();
      setCategoryProcess(processJson);

      const product = await fetch("/api/categoryCode?type=product");
      const productJson = await product.json();
      setCategoryProduct(productJson);
    } catch (err) {
      console.log("err: " + err);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadCategory();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">자재 선택</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            {/* 첫 번째 행 - 대분류 */}
            <tr className="bg-gray-200">
              <th className="th-base" rowSpan={3}>공정</th>
              <th className="th-base" rowSpan={3}>품명</th>
              <th className="th-base" rowSpan={3}>단위</th>
              <th className="th-base" rowSpan={3}>수량</th>
              <th className="th-base" colSpan={3}>재료비</th>
              <th className="th-base" colSpan={3}>노무비</th>
              <th className="th-base" colSpan={3}>경비</th>
              <th className="th-base" rowSpan={3}>총합산</th>
              <th className="th-base" rowSpan={3}>추가</th>
            </tr>

            {/* 두 번째 행 - 세부 항목 */}
            <tr className="bg-gray-100">
              <th className="th-base">금액</th>
              <th className="th-base">수량</th>
              <th className="th-base">재료비 합산</th>
              <th className="th-base">금액</th>
              <th className="th-base">수량</th>
              <th className="th-base">노무비 합산</th>
              <th className="th-base">금액</th>
              <th className="th-base">수량</th>
              <th className="th-base">경비 합산</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* 공정 */}
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  onChange={handlerCategoryChange}
                  value={selectCategory}
                  items={categoryProcess}
                  placeholder="선택"
                />
              </td>
              {/* 품명 */}
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  items={filteredProducts}
                  placeholder="선택"
                  disabled={!selectCategory}
                  valueField="id"
                  labelField="name"
                />
              </td>
              {/* 단위 */}
              <td className="border-base w-20">
                <CommonInput
                  type="text"
                  className="td-base"
                  value={selectedUnit}
                  readOnly={true}
                />
              </td>
              {/* 수량 */}
              <td className="border-base w-20">
                <CommonInput
                  type="number"
                  className="td-base"
                  value={quantity || ""}
                  placeholder="수량"
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </td>

              {/* 재료비 */}
              <td className="border-base w-32">
                <CommonInput
                  type="number"
                  className="td-base"
                  placeholder="재료비"
                  value={unitPrice1 || ""}
                  onChange={handleUnitPriceChange1}
                />
              </td>
              <td className="border-base w-20">
                <CommonInput
                  type="number"
                  className="td-base"
                  value={quantity || ""}
                  readOnly={true}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </td>
              <td className="border-base text-right font-medium">
                {getTotalPrice().toLocaleString("ko-KR")} 원
              </td>

              {/* 노무비 */}
              <td className="border-base w-32">
                <CommonInput
                  type="number"
                  className="td-base"
                  placeholder="노무비"
                  value={unitPrice2 || ""}
                  onChange={handleUnitPriceChange2}
                />
              </td>
              <td className="border-base w-20">
                <CommonInput
                  type="number"
                  className="td-base"
                  value={quantity || ""}
                  readOnly={true}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </td>
              <td className="border-base text-right font-medium"> {getTotalPrice().toLocaleString("ko-KR")} 원 </td>

              <td className="border-base w-32">
                <CommonInput
                  type="number"
                  className="td-base"
                  placeholder="경비"
                  value={unitPrice3 || ""}
                  onChange={handleUnitPriceChange3}
                />
              </td>
              <td className="border-base w-20">
                <CommonInput
                  type="number"
                  className="td-base"
                  value={quantity || ""}
                  readOnly={true}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </td>
              <td className="border-base text-right font-medium"> {getTotalPrice().toLocaleString("ko-KR")} 원 </td>

              <td className="border-base text-right font-medium">
                {getTotalPrice().toLocaleString("ko-KR")} 원
              </td>
              <td className="border-base text-right font-medium">
                <button className="btn-add" onClick={addItem}>
                  추가
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
