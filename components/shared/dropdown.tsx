"use client";

import { startTransition, useEffect, useState } from "react";
import type { ICategory } from "@/lib/database/models/category.model";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "../ui/input";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";

type DropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
};

function Dropdown({ onChangeHandler, value }: DropdownProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState(value ?? "");

  const handleAddCategory = async () => {
    const category = await createCategory({
      categoryName: newCategory.trim(),
    });

    setCategories((prev) => [...prev, category]);
    setNewCategory("");
    setOpen(false);
    setSelectValue(category._id); // auto-select new category
    onChangeHandler?.(category._id);
  };

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      if (categoryList) setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);

  return (
    <>
      <Select
        value={selectValue}
        onValueChange={(value) => {
          if (value === "__add_new__") {
            // 🔑 let Select close first
            setTimeout(() => setOpen(true), 0);
            setSelectValue(""); // reset selection
            return;
          }

          setSelectValue(value);
          onChangeHandler?.(value);
        }}
      >
        <SelectTrigger className="select-field">
          <SelectValue placeholder="Category" />
        </SelectTrigger>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category._id.toString()}
              value={category._id.toString()}
            >
              {category.name}
            </SelectItem>
          ))}

          <SelectItem value="__add_new__" className="text-primary-500">
            + Add new category
          </SelectItem>
        </SelectContent>
      </Select>

      {/* ✅ Dialog OUTSIDE Select */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Category</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => startTransition(handleAddCategory)}
            >
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Dropdown;
