"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import changeTypeName from "@/lib/helpers";
import SelectDropdown from "@/src/component/ui/SelectDropDown";
import { CommonInput } from "@/src/component/ui/InputComponents";

export default function categoryCode() {
  const [activeTab, setActiveTab] = useState("공정");
  const tabs = ["공정", "품명"];
  const [currentData, setCurrentData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [inputNameValue, setInputNameValue] = useState("");
  const [inputUnitValue, setInputUnitValue] = useState("");
  const [selectProcess, setSelectProcess] = useState("");

  const loadData = async () => {
    try {
      const processRslt = await fetch("/api/categoryCode?type=process");
      const processRsltJson = await processRslt.json();
      setProcessData(processRsltJson);

      const productRslt = await fetch("/api/categoryCode?type=product");
      const productRsltJson = await productRslt.json();
      setProductData(productRsltJson);
    } catch (err) {
      console.log("err: " + err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "공정") {
      setCurrentData(processData);
    } else if (activeTab === "품명") {
      setCurrentData(productData);
    }
  }, [activeTab, processData, productData]);

  //항목 추가.
  const addItem = async (tab) => {
    let type = changeTypeName(tab);

    if (!inputNameValue) {
      alert("이름 입력값이 존재하지 않음.");
      return false;
    }

    if (type === "product" && !inputUnitValue) {
      alert("단위 입력값이 존재하지 않음.");
      return false;
    }

    // 품명일 경우 공정 선택 유무 확인
    if (type === "product") {
      if (!selectProcess) {
        alert("공정을 선택 하세요.");
        return false;
      }
    }

    try {
      const response = await fetch("/api/categoryCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          name: inputNameValue,
          step1: type === "product" ? selectProcess : null,
          step2:
            type === "process"
              ? "#"
              : type === "product"
              ? inputNameValue
              : null,
          unit: type === "product" ? inputUnitValue : null,
          regi_name: "관리자",
        }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      loadData();
      setInputNameValue("");
      setSelectProcess("");
    } catch (err) {
      console.error("항목 추가 오류: ", err);
      alert("항목 추가 중 오류가 발생했습니다.");
    }
  };

  const handleInputNameChange = (e) => {
    setInputNameValue(e.target.value);
  };

  const handleInputUnitChange = (e) => {
    setInputUnitValue(e.target.value);
  };

  const toggleStatus = async (itemId, tab) => {
    let newStatus;

    if (tab === "공정") {
      setProcessData(
        processData.map((item) => {
          if (item.id === itemId) {
            newStatus = item.status === "Y" ? "N" : "Y";
            return { ...item, status: newStatus };
          }
          return item;
        })
      );
    } else if (tab === "품명") {
      setProductData(
        productData.map((item) => {
          if (item.id === itemId) {
            newStatus = item.status === "Y" ? "N" : "Y";
            return { ...item, status: newStatus };
          }
          return item;
        })
      );
    }

    try {
      let type = changeTypeName(tab);
      const resposne = await fetch("/api/categoryCode", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemId,
          type: type,
          status: newStatus,
        }),
      });
    } catch (error) {
      console.error("사용 미사용 토글 오류:", error);
    }
  };

  const handlerSelectProcessChange = (e) => {
    setSelectProcess(e.target.value);
    console.log(selectProcess);
  };

  const handlerDeleteData = async (id, name, tab) => {
    if (
      confirm(
        `정말로 ${name} 을 삭제 하시겠습니까? 공정일 경우 하위 품명까지 전부 삭제 됩니다.`
      )
    ) {
      try {
        const resposne = await fetch("/api/categoryCode", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            id: id,
            tab: tab,
          }),
        });
        loadData();
      } catch (err) {
        console.err("삭제 실패: ", err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">분류 코드 관리</h1>

      <div className="flex justify-between items-center border-b border-gray-200 mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-medium text-sm focus:outline-none 
                ${
                  activeTab === tab
                    ? "border-b-4 border-blue-500 text-blue-600"
                    : "text-gray-900 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex space-x-3">
          {activeTab === "품명" && (
            <SelectDropdown
              className="py-2 px-4 font-medium text-sm border-2 border-blue-500 rounded-lg"
              onChange={handlerSelectProcessChange}
              value={selectProcess}
              items={processData}
              placeholder="선택"
            />
          )}
          <CommonInput
            type="text"
            value={inputNameValue}
            onChange={handleInputNameChange}
            className="py-2 px-4 font-medium text-sm border-2 border-blue-500 rounded-lg"
            placeholder={`${activeTab} 이름`}
          />
          {activeTab === "품명" && (
            <CommonInput
              type="text"
              value={inputUnitValue}
              onChange={handleInputUnitChange}
              className="py-2 px-4 font-medium text-sm border-2 border-blue-500 rounded-lg"
              placeholder={"단위"}
            />
          )}
          <button
            className="btn-add"
            d
            onClick={() => addItem(activeTab)}
            disabled={!inputNameValue.trim()} // 입력값이 없으면 버튼 비활성화
          >
            {activeTab} 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {activeTab === "품명" && <th className="th-base">공정</th>}
              <th className="th-base">이름</th>
              {activeTab === "품명" && <th className="th-base">단위</th>}
              <th className="th-base">등록자</th>
              <th className="th-base">추가날짜</th>
              <th className="th-base">사용여부</th>
              <th className="th-base">삭제</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id}>
                {activeTab === "품명" && (
                  <td className="border-base">{item.step1}</td>
                )}
                <td className="border-base">{item.name}</td>
                {activeTab === "품명" && (
                  <td className="border-base">{item.unit}</td>
                )}
                <td className="border-base">{item.regi_name}</td>
                <td className="border-base">
                  {format(item.date_added, "yyyy년 MM월 dd일")}
                </td>
                <td className="border-base">
                  <div className="inline-flex items-center gap-2">
                    <label
                      htmlFor={`switch-${item.id}`}
                      className="text-slate-600 text-sm cursor-pointer"
                    >
                      미사용
                    </label>

                    <div className="relative inline-block w-11 h-5">
                      <input
                        id={`switch-${item.id}`}
                        type="checkbox"
                        checked={item.status === "Y"}
                        onChange={() => toggleStatus(item.id, activeTab)}
                        className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-blue-600 cursor-pointer transition-colors duration-300"
                      />
                      <label
                        htmlFor={`switch-${item.id}`}
                        className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                      ></label>
                    </div>

                    <label
                      htmlFor={`switch-${item.id}`}
                      className="text-slate-600 text-sm cursor-pointer"
                    >
                      사용
                    </label>
                  </div>
                </td>
                <td className="border-base">
                  <button
                    className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-1 px-2 rounded-lg"
                    onClick={() =>
                      handlerDeleteData(item.id, item.name, activeTab)
                    }
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
