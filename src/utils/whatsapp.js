/**
 * WhatsApp Integration Utility
 * Generates and opens WhatsApp message for order
 */

const ADMIN_NUMBER = '918124483546'; // Hardcoded admin number

/**
 * Formats order message for WhatsApp
 * @param {Object} orderData - Order data containing customer info and items
 * @returns {string} Formatted message
 */
export function formatOrderMessage(orderData) {
  const { customerInfo, items, totalAmount } = orderData;

  let message = `New Order - Jeyam Fancy Store\n\n`;
  message += `Customer Details:\n`;
  message += `Name: ${customerInfo.name}\n`;
  message += `Phone: ${customerInfo.phone}\n`;
  message += `Email: ${customerInfo.email || 'N/A'}\n`;
  message += `Address: ${customerInfo.address}\n`;
  message += `Pincode: ${customerInfo.pincode}\n\n`;
  message += `Items:\n`;

  items.forEach((cartItem) => {
    const { item, quantity } = cartItem;
    const itemTotal = item.price * quantity;
    const unitText = quantity === 1 ? item.unit : `${item.unit}s`;
    message += `- ${item.name} - ${quantity} ${unitText} - ₹${itemTotal}\n`;
  });

  message += `\nTotal Amount: ₹${totalAmount}`;

  return message;
}

/**
 * Opens WhatsApp with pre-filled order message
 * @param {Object} orderData - Order data containing customer info and items
 */
export function sendOrderViaWhatsApp(orderData) {
  const message = formatOrderMessage(orderData);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${ADMIN_NUMBER}?text=${encodedMessage}`;
  
  // Open WhatsApp in new window/tab
  window.open(whatsappUrl, '_blank');
}

