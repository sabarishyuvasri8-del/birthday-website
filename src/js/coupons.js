/**
 * Birthday Passport & Love Coupons (Image 5 bottom)
 */
import confetti from 'canvas-confetti';

export function initCoupons() {
  const couponItems = document.querySelectorAll('.coupon-item');

  function getRedeemedList() {
    try {
      const stored = localStorage.getItem('love_coupons_redeemed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function saveRedeemedList(list) {
    localStorage.setItem('love_coupons_redeemed', JSON.stringify(list));
  }

  const redeemed = getRedeemedList();

  couponItems.forEach((item) => {
    const couponId = item.getAttribute('data-coupon');
    const redeemBtn = item.querySelector('.redeem-btn');

    if (redeemed.includes(couponId)) {
      item.classList.add('redeemed');
      if (redeemBtn) {
        redeemBtn.textContent = 'Already Redeemed ♡';
        redeemBtn.disabled = true;
        redeemBtn.style.opacity = '0.6';
      }
    }

    redeemBtn?.addEventListener('click', () => {
      if (item.classList.contains('redeemed')) return;

      item.classList.add('redeemed');
      redeemBtn.textContent = 'Already Redeemed ♡';
      redeemBtn.disabled = true;
      redeemBtn.style.opacity = '0.6';

      const currentRedeemed = getRedeemedList();
      if (!currentRedeemed.includes(couponId)) {
        currentRedeemed.push(couponId);
        saveRedeemedList(currentRedeemed);
      }

      // Celebratory pop!
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#EC4899', '#8B5CF6', '#F43F5E']
      });
    });
  });
}
