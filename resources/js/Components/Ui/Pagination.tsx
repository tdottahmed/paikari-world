import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginatedData } from "@/types";

interface PaginationProps<T> {
    data: PaginatedData<T>;
    preserveScroll?: boolean;
}

const Pagination = <T,>({
    data,
    preserveScroll = true,
}: PaginationProps<T>) => {
    if (data.last_page <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = data;

        pages.push(1);

        if (current_page > 3) {
            pages.push("...");
        }

        for (
            let i = Math.max(2, current_page - 1);
            i <= Math.min(last_page - 1, current_page + 1);
            i++
        ) {
            pages.push(i);
        }

        if (current_page < last_page - 2) {
            pages.push("...");
        }

        if (last_page > 1) {
            pages.push(last_page);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-b-lg">
            <div className="flex flex-1 justify-between sm:hidden">
                {data.prev_page_url ? (
                    <Link
                        href={data.prev_page_url}
                        preserveScroll={preserveScroll}
                        className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                        Previous
                    </span>
                )}
                {data.next_page_url ? (
                    <Link
                        href={data.next_page_url}
                        preserveScroll={preserveScroll}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                        Next
                    </span>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing{" "}
                        <span className="font-medium"> {data.from || 0} </span>{" "}
                        to <span className="font-medium"> {data.to || 0} </span>{" "}
                        of <span className="font-medium"> {data.total} </span>{" "}
                        results
                    </p>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        {data.prev_page_url ? (
                            <Link
                                href={data.prev_page_url}
                                preserveScroll={preserveScroll}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                            >
                                <span className="sr-only"> Previous </span>
                                <ChevronLeft
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 cursor-not-allowed opacity-50">
                                <span className="sr-only"> Previous </span>
                                <ChevronLeft
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </span>
                        )}

                        {getPageNumbers().map((page, index) => {
                            if (page === "...") {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const pageNumber = page as number;
                            const isActive = pageNumber === data.current_page;
                            const pageUrl = `${data.path}?page=${pageNumber}`;

                            return isActive ? (
                                <span
                                    key={pageNumber}
                                    aria-current="page"
                                    className="relative z-10 inline-flex items-center bg-emerald-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                >
                                    {pageNumber}
                                </span>
                            ) : (
                                <Link
                                    key={pageNumber}
                                    href={pageUrl}
                                    preserveScroll={preserveScroll}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                                >
                                    {pageNumber}
                                </Link>
                            );
                        })}

                        {data.next_page_url ? (
                            <Link
                                href={data.next_page_url}
                                preserveScroll={preserveScroll}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                            >
                                <span className="sr-only"> Next </span>
                                <ChevronRight
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 cursor-not-allowed opacity-50">
                                <span className="sr-only"> Next </span>
                                <ChevronRight
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
