"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProjectForm({
  initialData = {},
  isReadOnly = false,
  onDataChange,
}) {
  const [project, setProject] = useState({
    project_name: "",
    client_name: "",
    start_date: null,
    end_date: null,
    description: "",
    ...initialData, // initialData가 있으면 덮어쓴다.
  });

  useEffect(() => {
    if (onDataChange) {
      onDataChange(project);
    }
  }, [project, onDataChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, fieldName) => {
    setProject((prev) => ({ ...prev, [fieldName]: date }));
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
      <div>
        <label
          htmlFor="project_name"
          className="block text-sm font-medium text-gray-700"
        >
          프로젝트명
        </label>
        <input
          id="project_name"
          name="project_name"
          type="text"
          value={project.project_name || ""}
          onChange={handleChange}
          disabled={isReadOnly}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="프로젝트명을 입력하세요"
        />
      </div>
      <div>
        <label
          htmlFor="project_duration"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          프로젝트 기간
        </label>
        <div className="flex space-x-2">
          <DatePicker
            selected={project.start_date ? new Date(project.start_date) : null}
            onChange={(date) => handleDateChange(date, "start_date")}
            selectsStart
            startDate={project.start_date ? new Date(project.start_date) : null}
            endDate={project.end_date ? new Date(project.end_date) : null}
            dateFormat="yyyy-MM-dd"
            placeholderText="시작일"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={isReadOnly}
          />
          <span>~</span>
          <DatePicker
            selected={project.end_date ? new Date(project.end_date) : null}
            onChange={(date) => handleDateChange(date, "end_date")}
            selectsEnd
            startDate={project.start_date ? new Date(project.start_date) : null}
            endDate={project.end_date ? new Date(project.end_date) : null}
            minDate={project.start_date ? new Date(project.start_date) : null}
            dateFormat="yyyy-MM-dd"
            placeholderText="종료일"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={isReadOnly}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          설명
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={project.description || ""}
          onChange={handleChange}
          disabled={isReadOnly}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="설명을 입력하세요"
        />
      </div>
      <div>
        <label
          htmlFor="client_name"
          className="block text-sm font-medium text-gray-700"
        >
          고객명
        </label>
        <input
          id="client_name"
          name="client_name"
          type="text"
          value={project.client_name || ""}
          onChange={handleChange}
          disabled={isReadOnly}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="고객명을 입력하세요"
        />
      </div>
    </div>
  );
}
