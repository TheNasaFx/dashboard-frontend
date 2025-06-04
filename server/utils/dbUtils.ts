import { query } from "./db";

export async function getSetting(
  idOrShortname: number | string
): Promise<string | null> {
  let sql: string;
  let values: (number | string)[];

  if (typeof idOrShortname === "number") {
    sql = "SELECT `value` FROM `settings` WHERE `id` = ? LIMIT 1";
    values = [idOrShortname];
  } else {
    sql = "SELECT `value` FROM `settings` WHERE `shortname` = ? LIMIT 1";
    values = [idOrShortname];
  }

  const result = (await query(sql, values)) as { value: string }[];

  if (result.length > 0) {
    return result[0].value;
  } else {
    return null; // PHP returned "", using null for clarity in TS
  }
}

/**
 * Fetches a parameter value from the database by name.
 * Migrated from helper.php -> parameters()
 */
export async function getParameter(paramName: string): Promise<string | null> {
  const sql = "SELECT `value` FROM `parameters` WHERE `name` = ? LIMIT 1";
  const values = [paramName];

  const result = (await query(sql, values)) as { value: string }[];

  if (result.length > 0) {
    return result[0].value;
  } else {
    return null; // PHP returned "", using null for clarity in TS
  }
}

/**
 * Fetches a product price based on product ID and rank.
 * Migrated from helper.php -> price()
 */
export async function getPrice(
  productId: number,
  rank: string
): Promise<number> {
  const sql = "SELECT * FROM `products` WHERE `id` = ? LIMIT 1";
  const values = [productId];

  const products = (await query(sql, values)) as any[]; // Use any for flexible data access

  if (products.length > 0) {
    const product = products[0];
    let priceValue = 0;

    // Construct the column name dynamically based on rank
    const priceColumn = `price_${rank.toUpperCase()}`; // Ensure uppercase like PHP

    // Check if the column exists and is a number
    if (product && typeof product[priceColumn] === "number") {
      priceValue = product[priceColumn];
    } else if (product && typeof product["price_G3"] === "number") {
      // Default case from PHP
      priceValue = product["price_G3"];
    }

    return priceValue;
  } else {
    return 0; // PHP returned 0 if product not found
  }
}

/**
 * Fetches customer information based on customer ID and parameter.
 * Migrated from helper.php -> customer()
 */
export async function getCustomerInfo(
  customerId: number,
  parameter: string
): Promise<string | number | null> {
  if (customerId < 0) {
    return null; // PHP returned "" for negative customer_id
  }

  // Handle the admin case (customer_id 0)
  if (customerId === 0) {
    switch (parameter) {
      case "name":
        return "Shuurkhai.com";
      case "surname":
        return "";
      case "rd":
        return "";
      case "address":
        return "4712 OAKTON STREET, 60076, Chicago IL";
      case "address_extra":
        return "";
      case "tel":
        return "773-621-6807";
      case "last_log":
        return "";
      case "email":
        return "";
      case "full_name":
        return "Shuurkhai.com";
      case "cent":
        return 0;
      default:
        return ""; // PHP returned "" for unknown parameters
    }
  }

  // Handle regular customer IDs
  const sql = "SELECT * FROM `customer` WHERE `customer_id` = ? LIMIT 1";
  const values = [customerId];

  const customers = (await query(sql, values)) as any[];

  if (customers.length > 0) {
    const customer = customers[0];
    switch (parameter) {
      case "name":
        return customer.name;
      case "surname":
        return customer.surname;
      case "rd":
        return customer.rd;
      case "address":
        return customer.address;
      case "address_extra":
        return customer.address_extra;
      case "tel":
        return customer.tel;
      case "last_log":
        return customer.last_log;
      case "email":
        return customer.email;
      case "full_name":
        return `${customer.name} ${customer.surname}`;
      case "cent":
        return customer.cent;
      default:
        return ""; // PHP returned "" for unknown parameters
    }
  } else {
    return ""; // PHP returned "" if customer not found
  }
}

/**
 * Fetches order information based on order ID and parameter.
 * Migrated from helper.php -> order()
 */
export async function getOrderInfo(
  orderId: number,
  parameter: string
): Promise<string | number | null> {
  const sql = "SELECT * FROM `orders` WHERE `order_id` = ? LIMIT 1";
  const values = [orderId];

  const orders = (await query(sql, values)) as any[];

  if (orders.length > 0) {
    const order = orders[0];
    switch (parameter) {
      case "weight":
        return order.weight; // Assuming weight is a number or string
      case "track":
        return order.third_party; // Assuming third_party is the track number string
      case "barcode":
        return order.barcode; // Assuming barcode is a string
      default:
        return ""; // PHP returned "" for unknown parameters
    }
  } else {
    return ""; // PHP returned "" if order not found
  }
}

/**
 * Fetches proxy information based on proxy ID and parameter.
 * Migrated from helper.php -> proxy()
 */
export async function getProxyInfo(
  proxyId: number,
  parameter: string
): Promise<string | null> {
  const sql = "SELECT * FROM `proxies` WHERE `proxy_id` = ? LIMIT 1";
  const values = [proxyId];

  const proxies = (await query(sql, values)) as any[];

  if (proxies.length > 0) {
    const proxy = proxies[0];
    switch (parameter) {
      case "name":
        return proxy.name;
      case "surname":
        return proxy.surname;
      case "address":
        return proxy.address;
      case "tel":
        return proxy.tel;
      case "full_name":
        return `${proxy.surname} ${proxy.name}`;
      default:
        return ""; // PHP returned "" for unknown parameters
    }
  } else {
    return ""; // PHP returned "" if proxy not found
  }
}

/**
 * Calculates a price based on weight and payment rate settings.
 * Migrated from helper.php -> cfg_price()
 */
export async function calculateCfgPrice(weight: number): Promise<number> {
  const paymentRateStr = await getSetting("paymentrate");
  const paymentRateMinStr = await getSetting("paymentrate_min");

  // Convert settings to numbers. Use default 0 if settings are null or invalid.
  const paymentRate = paymentRateStr ? parseFloat(paymentRateStr) : 0;
  const paymentRateMin = paymentRateMinStr ? parseFloat(paymentRateMinStr) : 0;

  if (weight > 1) {
    return paymentRate * weight;
  } else if (weight >= 0.5) {
    return paymentRate; // PHP returned settings("paymentrate") for >= 0.5 and <= 1
  } else if (weight === 0) {
    return 0;
  } else {
    // weight is > 0 and < 0.5
    return paymentRateMin; // PHP returned settings("paymentrate_min")
  }
}

/**
 * Calculates a price based on weight using an older logic and payment rate settings.
 * Migrated from helper.php -> cfg_price_old()
 */
export async function calculateCfgPriceOld(weight: number): Promise<number> {
  const paymentRateStr = await getSetting("paymentrate");
  const paymentRateMinStr = await getSetting("paymentrate_min");

  // Convert settings to numbers. Use default 0 if settings are null or invalid.
  const paymentRate = paymentRateStr ? parseFloat(paymentRateStr) : 0;
  const paymentRateMin = paymentRateMinStr ? parseFloat(paymentRateMinStr) : 0;

  if (weight > 1) {
    return (paymentRate - 1) * weight; // PHP logic: (paymentrate - 1) * weight
  } else if (weight >= 0.5) {
    return paymentRate - 1; // PHP logic: paymentrate - 1 for >= 0.5 and <= 1
  } else if (weight === 0) {
    return 0;
  } else {
    // weight is > 0 and < 0.5
    return paymentRateMin; // PHP logic: paymentrate_min
  }
}

/**
 * Fetches customer address information by joining customer, city, and district tables.
 * Migrated from helper.php -> address()
 */
export async function getCustomerAddress(customerId: number): Promise<string> {
  const sql = `SELECT city.name city_name, district.name district_name, customer.address_khoroo khoroo, address_build build, customer.address_extra extra
               FROM customer 
               LEFT JOIN city ON customer.address_city = city.id
               LEFT JOIN district ON customer.address_district = district.id
               WHERE customer.customer_id= ? LIMIT 1`;
  const values = [customerId];

  const result = (await query(sql, values)) as any[];

  if (result.length > 0) {
    const data = result[0];
    // Concatenate address parts, handling potential nulls or undefineds
    const addressParts = [
      data.city_name,
      data.district_name,
      data.khoroo,
      data.build,
      data.extra,
    ].filter((part) => part);

    return addressParts.join(" ");
  } else {
    return ""; // PHP returned "" if no address found
  }
}

/**
 * Fetches delivery address information by joining customer_address, city, and district tables.
 * Migrated from helper.php -> address_deliver()
 */
export async function getDeliveryAddress(addressId: number): Promise<string> {
  const sql = `SELECT customer_address.*, city.name city_name, district.name district_name
                 FROM customer_address
                 LEFT JOIN city ON customer_address.city = city.id
                 LEFT JOIN district ON customer_address.district = district.id
                 WHERE customer_address.id = ?
                 ORDER BY timestamp DESC LIMIT 1`; // PHP had ORDER BY timestamp DESC
  const values = [addressId];

  const result = (await query(sql, values)) as any[];

  if (result.length > 0) {
    const data = result[0];
    // Concatenate address parts similar to the original address function
    const addressParts = [
      data.city_name,
      data.district_name,
      data.khoroo, // Assuming customer_address table has khoroo, build, extra columns
      data.build,
      data.extra,
    ].filter((part) => part);

    return addressParts.join(" ");
  } else {
    return ""; // PHP returned "" if no address found
  }
}

/**
 * Updates the availability status of a proxy in the database.
 * Migrated from helper.php -> proxy_available()
 */
export async function updateProxyAvailability(
  proxyId: number,
  proxyType: number, // 0 for proxies, 1 for proxies_public
  status: number
): Promise<void> {
  let sql: string;
  const values = [status, proxyId];

  if (proxyType === 0) {
    sql = "UPDATE `proxies` SET `status` = ? WHERE `proxy_id` = ?";
  } else if (proxyType === 1) {
    sql = "UPDATE `proxies_public` SET `status` = ? WHERE `proxy_id` = ?";
  } else {
    console.warn(
      "Invalid proxyType provided to updateProxyAvailability:",
      proxyType
    );
    return; // Do nothing for invalid type
  }

  await query(sql, values);
  console.log(
    `Updated status for proxy ID ${proxyId} (type ${proxyType}) to ${status}`
  );
}

// TODO: Check for any other database utility functions in helper.php if needed.
// All identified database utility functions have been migrated.
