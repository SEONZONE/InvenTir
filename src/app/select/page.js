"use client";

import { useState, useEffect } from "react";
import SelectDropdown from '@/src/component/ui/SelectDropDown';
import { CommonInput } from '@/src/component/ui/InputComponents';

export default function MaterialTable() {
  const [selectCategory, setSelectCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice1, setUnitPrice1] = useState(0);
  const [unitPrice2, setUnitPrice2] = useState(0);
  const [unitPrice3, setUnitPrice3] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedScale, setSelectedScale] = useState("");
  const [items, setItems] = useState([]);
  const [categoryProcess, setCategoryProcess] = useState([]);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [categoryUnit, setCategoryUnit] = useState([]);
  const [categoryScale, setCategoryScale] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const subCategories = {
    돌: ["화강석", "대리석", "현무암", "사암"],
    나무: ["소나무", "참나무", "벚나무", "단풍나무"],
    장비: ["굴착기", "크레인", "콘크리트믹서", "지게차"],
  };

  const handlerCategoryChange = (e) => {
    const selectedProcess = e.target.value;
    setSelectCategory(selectedProcess);
    setSelectedSubCategory("");

    const filtered = categoryProduct.filter(item => item.step1 === selectedProcess);
    setFilteredProducts(filtered);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleScaleChange = (e) => {
    setSelectedScale(e.target.value);
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
      scale: selectedScale,
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
    setSelectedScale("");
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

      const unit = await fetch("/api/categoryCode?type=unit");
      const unitJson = await unit.json();
      setCategoryUnit(unitJson);

      const scale = await fetch("/api/categoryCode?type=scale");
      const scaleJson = await scale.json();
      setCategoryScale(scaleJson);
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
            <tr className="bg-gray-100">
              <th className="th-base">공정</th>
              <th className="th-base">품명</th>
              <th className="th-base">규격</th>
              <th className="th-base">단위</th>
              <th className="th-base">수량</th>
              <th className="th-base">재료비</th>
              <th className="th-base">노무비</th>
              <th className="th-base">경비</th>
              <th className="th-base">합산</th>
              <th className="th-base">추가</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  onChange={handlerCategoryChange}
                  value={selectCategory}
                  items={categoryProcess}
                  placeholder="선택"
                />
              </td>
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  items={filteredProducts}
                  placeholder="선택"
                  disabled={!selectCategory}
                />
              </td>
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  onChange={handleScaleChange}
                  value={selectedScale}
                  items={categoryScale}
                  placeholder="선택"
                />
              </td>
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  onChange={handleUnitChange}
                  value={selectedUnit}
                  items={categoryUnit}
                  placeholder="선택"
                />
              </td>
              <td className="border-base w-20">
                <CommonInput
                  type="number"
                  className="td-base"
                  value={quantity || ""}
                  placeholder="수량"
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </td>
              <td className="border-base w-32">
                <CommonInput
                  type="number"
                  className="td-base"
                  placeholder="재료비"
                  value={unitPrice1 || ""}
                  onChange={handleUnitPriceChange1}
                />
              </td>
              <td className="border-base w-32">
                <CommonInput
                  type="number"
                  className="td-base"
                  placeholder="노무비"
                  value={unitPrice2 || ""}
                  onChange={handleUnitPriceChange2}
                />
              </td>
              <td className="border-base w-32">
                <CommonInput
                  type="number"
                  className="td-base"
                  placeholder="경비"
                  value={unitPrice3 || ""}
                  onChange={handleUnitPriceChange3}
                />
              </td>
              <td className="border-base text-right font-medium">
                {getTotalPrice().toLocaleString("ko-KR")} 원
              </td>
              <td className="border-base text-right font-medium">
                <button className="btn-add" onClick={addItem}>
                  추가
                </button>
              </td>
            </tr>

            {/* 추가된 항목들 */}
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border-base">{item.category}</td>
                <td className="border-base">{item.subCategory}</td>
                <td className="border-base">{item.scale}</td>
                <td className="border-base">{item.unit}</td>
                <td className="border-base">{item.quantity}</td>
                <td className="border-base">
                  {item.unitPrice1.toLocaleString("ko-KR")}
                </td>
                <td className="border-base">
                  {item.unitPrice2.toLocaleString("ko-KR")}
                </td>
                <td className="border-base">
                  {item.unitPrice3.toLocaleString("ko-KR")}
                </td>
                <td className="border-base text-right font-medium">
                  {item.totalPrice.toLocaleString("ko-KR")} 원
                </td>
                <td className="border-base">
                  <button
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-lg"
                    onClick={() => removeItem(item.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100">
                <td
                  colSpan="8"
                  className="border-300 px-4 py-2 text-right font-bold"
                >
                  총액
                </td>
                <td className="border-300 px-4 py-2 text-right font-bold">
                  {items
                    .reduce((sum, item) => sum + item.totalPrice, 0)
                    .toLocaleString("ko-KR")}{" "}
                  원
                </td>
                <td className="border-300 px-4 py-2"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
