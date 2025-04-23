'use client'

import React from  'react';

export function CommonInput({
    type,
    value,
    onChange,
    className,
    placeholder
  }) {
    return (
    <input
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={`${placeholder} 입력`}
    />
    );
  }
  