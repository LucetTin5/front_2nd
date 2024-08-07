import { useCallback, useState } from 'react';

import type { Coupon } from '../../types';

export const useCouponForm = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  const editProperty = useCallback(
    <K extends keyof Coupon>(key: K, value: Coupon[K]) => {
      setNewCoupon({
        ...newCoupon,
        [key]: value,
      });
    },
    [newCoupon],
  );

  const submit = useCallback(() => {
    if (!newCoupon.name || !newCoupon.code || newCoupon.discountValue === 0) {
      alert('쿠폰 정보를 입력해주세요.');
      return;
    }
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
  }, [onCouponAdd, newCoupon]);

  return { newCoupon, editProperty, submit };
};
