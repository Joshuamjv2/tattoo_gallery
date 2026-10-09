// useFilterSort.ts
import { useMemo, useState } from 'react';
import { Tag } from '../../types/Tag';

export type SortOrder = 'asc' | 'desc';

interface UseFilterSortOptions<T> {
    data: T[];
    searchableFields?: (keyof T)[];
    filterByTags?: (item: T, selectedTags: string[]) => boolean;
}

export function useFilterSort<T>({
    data,
    searchableFields = [],
    filterByTags,
    }: UseFilterSortOptions<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const filteredData = useMemo(() => {
        let result = [...data];

    // Tag Filtering
    if (filterByTags && selectedTags.length > 0) {
        result = result.filter(item => filterByTags(item, selectedTags));
    }

    // Search Filtering
    if (searchQuery && searchableFields.length > 0) {
        const lowerQuery = searchQuery.toString().toLowerCase();
        result = result.filter(item => {
            const fieldMatch = searchableFields.some(field => {
            const value = item[field];
            return (
                typeof value === 'string' &&
                value.toLowerCase().includes(lowerQuery)
            );
            });

            const tagMatch = (() => {
            const tags = (item as any)['tags'];
            if (!tags) return false;
            const tagNames = (tags as any[]).map(tag =>
                typeof tag === 'string' ? tag : tag.tag
            );
            return tagNames.some((t: string) =>
                t?.toLowerCase().includes(lowerQuery)
            );
            })();

            return fieldMatch || tagMatch;
        });
    }

    // Sorting
        if (sortBy) {
        result.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }
            if (aVal instanceof Date && bVal instanceof Date) {
            return sortOrder === 'asc'
                ? aVal.getTime() - bVal.getTime()
                : bVal.getTime() - aVal.getTime();
            }
            return 0;
        });
    }

    return result;
    }, [data, selectedTags, searchQuery, sortBy, sortOrder]);

    return {
        filteredData,
        searchQuery,
        setSearchQuery,
        selectedTags,
        setSelectedTags,
        sortBy,
        selectedPriceRange,
        setSelectedPriceRange,
        setSortBy,
        sortOrder,
        setSortOrder,
    };
}