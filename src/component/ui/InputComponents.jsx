'use client'

import React from  'react';

export function CommonInput({
    type,
    value,
    onChange,
    className,
    placeholder,
    readOnly=false,
  }) {
    return (
    <input
        readOnly={readOnly}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={`${placeholder ? placeholder : ""} 입력`}
    />
    );
  }
  