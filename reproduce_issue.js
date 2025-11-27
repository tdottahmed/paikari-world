const isNewProduct = (createdAt, days = 30) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    
    console.log(`Checking date: ${createdAt}`);
    console.log(`Created Date: ${createdDate.toISOString()}`);
    console.log(`Threshold Date: ${thresholdDate.toISOString()}`);
    console.log(`Is New: ${createdDate > thresholdDate}`);
    
    return createdDate > thresholdDate;
};

// Test cases
const now = new Date();
const fiveDaysAgo = new Date(now);
fiveDaysAgo.setDate(now.getDate() - 5);

const thirtyFiveDaysAgo = new Date(now);
thirtyFiveDaysAgo.setDate(now.getDate() - 35);

console.log("--- Test Case 1: 5 days ago (Should be true) ---");
isNewProduct(fiveDaysAgo.toISOString());

console.log("\n--- Test Case 2: 35 days ago (Should be false) ---");
isNewProduct(thirtyFiveDaysAgo.toISOString());

console.log("\n--- Test Case 3: Laravel default timestamp format (e.g., 2023-10-27 12:00:00) ---");
// Simulating a Laravel timestamp string
const laravelTimestamp = fiveDaysAgo.toISOString().replace('T', ' ').substring(0, 19);
isNewProduct(laravelTimestamp);
