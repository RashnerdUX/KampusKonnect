import React from 'react'

export interface BlogCategorySortButtonProps {
    id: number;
  name: string;
  selected?: boolean;
  handleSort?: () => void;
}

const BlogCategorySortButton = ({id, name, selected, handleSort }: BlogCategorySortButtonProps) => {
  return (
    <button
        className={`px-6 py-2 rounded-full font-medium transition-colors ${
            selected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-primary/10"
            }`}
        onClick={handleSort}
    >
        {name}
    </button>
  )
}

export default BlogCategorySortButton;