// src/app/select/page.js
'use client';

import { useState, useEffect } from "react";
import SelectDropdown from "@/src/component/ui/SelectDropDown";
import { CommonInput } from "@/src/component/ui/InputComponents";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import ProjectForm from "@/src/component/ui/ProjectForm";

export default function ProjectCreationPage() {
  // Calculation Functions
  const calculateSubTotal = (qty, price) => qty * price;
  function calculateRowTotal(item) {
    const materialTotal = item.material_quantity * item.material_unit_price;
    const laborTotal = item.labor_quantity * item.labor_unit_price;
    const expensesTotal = item.expenses_quantity * item.expenses_unit_price;
    return materialTotal + laborTotal + expensesTotal;
  }

  // Project Info
  const [projectInfo, setProjectInfo] = useState({});

  
  // Category Data
  const [allProcesses, setAllProcesses] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Current Item Input
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [currentUnit, setCurrentUnit] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [materialPrice, setMaterialPrice] = useState(0);
  const [laborPrice, setLaborPrice] = useState(0);
  const [expensesPrice, setExpensesPrice] = useState(0);
  const [rowTotalPrice, setRowTotalPrice] = useState(0);

  // Added Items List
  const [addedItems, setAddedItems] = useState([]);


  
  useEffect(() => {
    const currentItem = {
      material_quantity: quantity,
      material_unit_price: materialPrice,
      labor_quantity: quantity,
      labor_unit_price: laborPrice,
      expenses_quantity: quantity,
      expenses_unit_price: expensesPrice,
    };
    const total = calculateRowTotal(currentItem);
    setRowTotalPrice(total);
  }, [quantity, materialPrice, laborPrice, expensesPrice]);

  // Effect to load category data
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const processRes = await fetch("/api/categoryCode?type=process");
        const processData = await processRes.json();
        setAllProcesses(processData);

        const productRes = await fetch("/api/categoryCode?type=product");
        const productData = await productRes.json();
        setAllProducts(productData);
      } catch (err) {
        console.error("Failed to load categories:", err);
        alert("분류 코드를 불러오는 데 실패했습니다.");
      }
    };
    loadCategories();
  }, []);

  // 총합계 계산
  useEffect(() => { 
    const AddTotalPrice = addedItems.reduce((total, item) => total + calculateRowTotal(item), 0);
    setTotalPrice(AddTotalPrice);
  }, [addedItems]);

  const handleProcessChange = (e) => {
    const processName = e.target.value;
    setSelectedProcess(processName);
    setFilteredProducts(allProducts.filter(p => p.step1 === processName));
    setSelectedProduct("");
    setCurrentUnit("");
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    const product = allProducts.find(p => p.id === parseInt(productId));
    if (product) {
      setCurrentUnit(product.unit || "");
    }
  };

  const clearInputFields = () => {
    setSelectedProcess("");
    setSelectedProduct("");
    setCurrentUnit("");
    setQuantity(0);
    setMaterialPrice(0);
    setLaborPrice(0);
    setExpensesPrice(0);
    setFilteredProducts([]);
  };

  const addItem = () => {
    if (!selectedProcess || !selectedProduct) {
      alert("공정과 품명을 선택해주세요.");
      return;
    }

    const product = allProducts.find(p => p.id === parseInt(selectedProduct));
    const newItem = {
      temp_id: Date.now(),
      category_code_id: parseInt(selectedProduct),
      process_name: selectedProcess,
      product_name: product.name,
      unit: currentUnit,
      material_quantity: quantity,
      material_unit_price: materialPrice,
      labor_quantity: quantity,
      labor_unit_price: laborPrice,
      expenses_quantity: quantity,
      expenses_unit_price: expensesPrice,
    };

    setAddedItems([...addedItems, newItem]);
    clearInputFields();
  };

  const removeItem = (temp_id) => {
    setAddedItems(addedItems.filter((item) => item.temp_id !== temp_id));
  };

  const handleSaveProject = async () => {
    if (!projectInfo.project_name || !projectInfo.start_date || !projectInfo.end_date || addedItems.length === 0) {
      alert("프로젝트명, 기간, 자재를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectInfo,
          start_date: format(projectInfo.start_date, 'yyyy-MM-dd'),
          end_date: format(projectInfo.end_date, 'yyyy-MM-dd'),
          totalPrice,
          materials: addedItems,
        }),
      });

      if (response.ok) {
        alert('프로젝트가 성공적으로 저장되었습니다.');
        setProjectInfo({});
        setAddedItems([]);
      } else {
        const errorData = await response.json();
        alert(`프로젝트 저장 실패: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('프로젝트 저장 중 오류가 발생했습니다.');
    }
  };

  const handleNumberInputChange = (setter) => (e) => {
    const value = e.target.value;
    // 빈 문자열이거나 숫자가 아닌 경우 0으로 처리
    const parsedValue = value === '' ? 0 : parseInt(value, 10);
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleProjectInfoChange = (newData) => { 
    setProjectInfo(newData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">프로젝트 생성</h1>

      <ProjectForm onDataChange={handleProjectInfoChange} />


      <h2 className="text-xl font-bold mb-4">자재 선택</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="th-base" rowSpan={2}>공정</th>
              <th className="th-base" rowSpan={2}>품명</th>
              <th className="th-base" rowSpan={2}>단위</th>
              <th className="th-base" rowSpan={2}>수량</th>
              <th className="th-base" colSpan={2}>재료비</th>
              <th className="th-base" colSpan={2}>노무비</th>
              <th className="th-base" colSpan={2}>경비</th>
              <th className="th-base" rowSpan={2}>합계</th>
              <th className="th-base" rowSpan={2}>추가</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="th-base">단가</th>
              <th className="th-base">합산</th>
              <th className="th-base">단가</th>
              <th className="th-base">합산</th>
              <th className="th-base">단가</th>
              <th className="th-base">합산</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* 공정 */}
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  onChange={handleProcessChange}
                  value={selectedProcess}
                  items={allProcesses}
                  placeholder="공정"
                  valueField="step1"
                  labelField="name"
                />
              </td>
              {/* 품명 */}
              <td className="border-base">
                <SelectDropdown
                  className="td-base"
                  onChange={handleProductChange}
                  value={selectedProduct}
                  items={filteredProducts}
                  placeholder="품명"
                  disabled={!selectedProcess}
                  valueField="id"
                  labelField="name"
                />
              </td>
              {/* 단위 */}
              <td className="border-base"><CommonInput className="td-base" type="text" value={currentUnit} readOnly /></td>
              
              {/* 수량 */}
              <td className="border-base"><CommonInput className="td-base" type="number" value={quantity} onChange={handleNumberInputChange(setQuantity)}/></td>
              
              {/* 재료비 */}
              <td className="border-base"><CommonInput className="td-base" type="number" value={materialPrice} onChange={handleNumberInputChange(setMaterialPrice)} /></td>
              <td className="border-base text-right">{calculateSubTotal(quantity, materialPrice).toLocaleString('ko-KR')}</td>

              {/* 노무비 */}
              <td className="border-base"><CommonInput className="td-base" type="number" value={laborPrice} onChange={handleNumberInputChange(setLaborPrice)} /></td>
              <td className="border-base text-right">{calculateSubTotal(quantity, laborPrice).toLocaleString('ko-KR')}</td>

              {/* 경비 */}
              <td className="border-base"><CommonInput className="td-base" type="number" value={expensesPrice} onChange={handleNumberInputChange(setExpensesPrice)} /></td>
              <td className="border-base text-right">{calculateSubTotal(quantity, expensesPrice).toLocaleString('ko-KR')}</td>

              {/* 합계 */}
              <td className="border-base text-right">{rowTotalPrice.toLocaleString('ko-KR')}</td>

              <td className="border-base"><button className="btn-add" onClick={addItem}>추가</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4">추가된 자재 목록</h2>
      {addedItems.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="th-base">공정</th>
                <th className="th-base">품명</th>
                <th className="th-base">수량</th>
                <th className="th-base">재료비(단가)</th>
                <th className="th-base">노무비(단가)</th>
                <th className="th-base">경비(단가)</th>
                <th className="th-base">전체 합산</th>
                <th className="th-base">삭제</th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item) => (
                <tr key={item.temp_id}>
                  <td className="border-base">{item.process_name}</td>
                  <td className="border-base">{item.product_name}</td>
                  <td className="border-base">{item.material_quantity}</td>
                  <td className="border-base text-center">{`${item.material_unit_price.toLocaleString('ko-KR')}원`}</td>
                  <td className="border-base text-center">{`${item.labor_unit_price.toLocaleString('ko-KR')}원`}</td>
                  <td className="border-base text-center">{`${item.expenses_unit_price.toLocaleString('ko-KR')}원`}</td>
                  <td className="border-base text-right">{calculateRowTotal(item).toLocaleString('ko-KR')}원</td>
                  <td className="border-base">
                    <button onClick={() => removeItem(item.temp_id)} className="btn-remove">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center p-4 font-bold text-lg">
            <span>총합계:</span>
            <span className="ml-2">{totalPrice.toLocaleString('ko-KR')}원</span>
          </div>
        </div>
      )}

      <div className="mt-8 text-right">
        <button onClick={handleSaveProject} className="btn-save">프로젝트 저장</button>
      </div>
    </div>
  );
}
