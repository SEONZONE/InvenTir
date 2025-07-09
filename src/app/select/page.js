// src/app/select/page.js
'use client';

import { useState, useEffect } from "react";
import SelectDropdown from "@/src/component/ui/SelectDropDown";
import { CommonInput } from "@/src/component/ui/InputComponents";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker CSS import
import { format } from 'date-fns'; // 날짜 포맷팅을 위해 date-fns import

export default function ProjectCreationPage() {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState(null); // Date 객체로 관리
  const [endDate, setEndDate] = useState(null);     // Date 객체로 관리
  const [projectDuration, setProjectDuration] = useState(""); // "YYYY-MM-DD ~ YYYY-MM-DD" 형식의 문자열

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

  // startDate 또는 endDate가 변경될 때 projectDuration 업데이트
  useEffect(() => {
    if (startDate && endDate) {
      setProjectDuration(
        `${format(startDate, 'yyyy-MM-dd')} ~ ${format(endDate, 'yyyy-MM-dd')}`
      );
    } else {
      setProjectDuration("");
    }
  }, [startDate, endDate]);

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

  const handleSaveProject = async () => {
    if (!projectName) {
      alert("프로젝트명을 입력해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      alert("프로젝트 기간을 선택해주세요.");
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      alert("프로젝트 시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }
    if (items.length === 0) {
      alert("추가된 자재가 없습니다. 자재를 추가해주세요.");
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          projectDuration,
          materials: items,
        }),
      });

      if (response.ok) {
        alert('프로젝트가 성공적으로 저장되었습니다.');
        // 저장 후 필요한 경우 페이지 이동 또는 상태 초기화
        // router.push('/projectList'); // 예시: 프로젝트 목록 페이지로 이동
        setProjectName("");
        setStartDate(null);
        setEndDate(null);
        setItems([]);
      } else {
        const errorData = await response.json();
        alert(`프로젝트 저장 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('프로젝트 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">프로젝트 생성</h1>

      <div className="mb-4 p-4 border rounded-lg shadow-sm bg-white">
        <div className="mb-2">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            프로젝트명
          </label>
          <CommonInput
            type="text"
            id="projectName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="프로젝트명을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="projectDuration" className="block text-sm font-medium text-gray-700 mb-1">
            프로젝트 기간
          </label>
          <div className="flex space-x-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>~</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate} // 시작일 이후만 선택 가능
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">자재 선택</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow mb-8">
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
                  items={Array.isArray(categoryProcess) ? categoryProcess : []}
                  placeholder="선택"
                />
              </td>
              {/* 품명 */}
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  items={Array.isArray(filteredProducts) ? filteredProducts : []}
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

      {/* 추가된 자재 리스트 */}
      <h2 className="text-xl font-bold mb-4">추가된 자재 목록</h2>
      {items.length === 0 ? (
        <p>추가된 자재가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="th-base">공정</th>
                <th className="th-base">품명</th>
                <th className="th-base">단위</th>
                <th className="th-base">수량</th>
                <th className="th-base">재료비</th>
                <th className="th-base">노무비</th>
                <th className="th-base">경비</th>
                <th className="th-base">총합산</th>
                <th className="th-base">삭제</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border-base">{item.category}</td>
                  <td className="border-base">{item.subCategory}</td>
                  <td className="border-base">{item.unit}</td>
                  <td className="border-base">{item.quantity}</td>
                  <td className="border-base text-right">{item.unitPrice1.toLocaleString("ko-KR")} 원</td>
                  <td className="border-base text-right">{item.unitPrice2.toLocaleString("ko-KR")} 원</td>
                  <td className="border-base text-right">{item.unitPrice3.toLocaleString("ko-KR")} 원</td>
                  <td className="border-base text-right">{item.totalPrice.toLocaleString("ko-KR")} 원</td>
                  <td className="border-base">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-right">
        <button
          onClick={handleSaveProject}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          프로젝트 저장
        </button>
      </div>
    </div>
  );
}
