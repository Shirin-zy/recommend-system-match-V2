import React, { useState } from "react";
import style from "./filter.less";
import { Checkbox, Button } from "antd";
import type { CheckboxChangeEvent } from "antd";
import { categories, level, sort } from "./category";
import { values } from "mobx";

interface Item {
  label: string;
  value: number;
}

interface Category {
  title: string;
  category: Item[];
}

interface CategoryProps {
  category: {
    category: Item[];
    title: string;
  };
  selectedCategories: number[];
  setSelectedCategories: (categories: number[]) => void;
}

interface LevelProps {
  selectLevel: number;
  setSelectLevel: (level: number) => void;
}

interface SortProps {
  selectSort: number;
  setSelectSort: (sort: number) => void;
}

interface FilterProps {
  selectedCategories: number[]; // 选中筛选类型列表
  setSelectedCategories: (categories: number[]) => void;
  selectLevel: number; // 比赛级别
  setSelectLevel: (level: number) => void;
  selectSort: number; // 排序方式
  setSelectSort: (sort: number) => void;
}

// 竞赛类别
const Category = ({
  category, // 分析数据
  selectedCategories, // 选中筛选类型列表
  setSelectedCategories,
}: CategoryProps) => {
  const handleCategoryChange = (values: number, e: CheckboxChangeEvent) => {
    // 如果选择项true，则将值添加到selectedCategories中，否则从selectedCategories中删除该值
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, values]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== values)
      );
    }
  };

  return (
    <>
      <div className={style.category_box}>
        <div className={style.title}>
          <h5>{category.title}</h5>
        </div>
        <div className={style.gridContainer}>
          {category.category.map((categiry) => (
            <div key={categiry.value} className={style.checkbox}>
              <Checkbox
                onChange={(e) => {
                  handleCategoryChange(categiry.value, e);
                  console.log(selectedCategories);
                }}
                checked={selectedCategories.includes(categiry.value)}
              >
                {categiry.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// 竞赛级别
const Level = ({ selectLevel, setSelectLevel }: LevelProps) => {
  const handLevelChange = (values: number) => {
    setSelectLevel(values);
  };
  return (
    <>
      <div className={style.box}>
        <div className={style.layout}>
          {level.map((item) => (
            <Button
              key={item.value}
              size="small"
              className={
                selectLevel === item.value
                  ? style.selectedButtonStyle
                  : style.unselectedButtonStyle
              }
              onClick={() => handLevelChange(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

// 排序方式
const Sort = ({ selectSort, setSelectSort }: SortProps) => {
  const handSortChange = (values: number) => {
    setSelectSort(values);
  };
  return (
    <>
      <div className={style.box}>
        <div className={style.layout}>
          {sort.map((item) => (
            <Button
              key={item.value}
              size="small"
              className={
                selectSort === item.value
                  ? style.selectedButtonStyle
                  : style.unselectedButtonStyle
              }
              onClick={() => handSortChange(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

// 筛选组件
const Filter = ({
  selectedCategories,
  setSelectedCategories,
  selectLevel,
  setSelectLevel,
  selectSort,
  setSelectSort,
}: FilterProps) => {
  return (
    <>
      <div className={style.filter}>
        <div className={style.category}>
          <h3>竞赛类别</h3>
          {categories.map((category) => (
            <Category
              key={category.title}
              category={category}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          ))}
        </div>
        <div className={style.category}>
          <h3>竞赛级别</h3>
          <Level selectLevel={selectLevel} setSelectLevel={setSelectLevel} />
        </div>
        <div className={style.category}>
          <h3>排序方式</h3>
          <Sort selectSort={selectSort} setSelectSort={setSelectSort} />
        </div>
      </div>
    </>
  );
};

export default Filter;
