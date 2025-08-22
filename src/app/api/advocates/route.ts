import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  try {
    // Check if we have a real database connection
    if (!process.env.DATABASE_URL) {
      // Fallback to static data with client-side filtering
      let filteredData = [...advocateData];

      if (search.trim()) {
        const searchTerm = search.toLowerCase();
        filteredData = filteredData.filter(
          (advocate) =>
            advocate.firstName.toLowerCase().includes(searchTerm) ||
            advocate.lastName.toLowerCase().includes(searchTerm) ||
            advocate.city.toLowerCase().includes(searchTerm) ||
            advocate.degree.toLowerCase().includes(searchTerm) ||
            advocate.specialties.some((specialty) =>
              specialty.toLowerCase().includes(searchTerm)
            ) ||
            advocate.yearsOfExperience.toString().includes(searchTerm) ||
            advocate.phoneNumber.toString().includes(searchTerm)
        );
      }

      const totalCount = filteredData.length;
      const totalPages = Math.ceil(totalCount / limit);
      const paginatedData = filteredData.slice(offset, offset + limit);

      return Response.json({
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          pageSize: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      });
    }

    // For now, just return all data from database without complex filtering
    // This avoids the TypeScript issues while still providing pagination
    const allData = await db.select().from(advocates);

    // Apply client-side filtering for now
    let filteredData = allData;

    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter(
        (advocate) =>
          advocate.firstName.toLowerCase().includes(searchTerm) ||
          advocate.lastName.toLowerCase().includes(searchTerm) ||
          advocate.city.toLowerCase().includes(searchTerm) ||
          advocate.degree.toLowerCase().includes(searchTerm) ||
          (advocate.specialties as string[]).some((specialty) =>
            specialty.toLowerCase().includes(searchTerm)
          ) ||
          advocate.yearsOfExperience.toString().includes(searchTerm) ||
          advocate.phoneNumber.toString().includes(searchTerm)
      );
    }

    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedData = filteredData.slice(offset, offset + limit);

    return Response.json({
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error("Database query error:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
