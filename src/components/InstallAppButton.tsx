'use client';

import { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, Monitor, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type DeviceType = 'ios' | 'android' | 'desktop';

export function InstallAppButton() {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Kiểm tra trạng thái đã cài đặt (Standalone PWA)
    const checkStandalone = () => {
      const isDisplayStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      setIsStandalone(isDisplayStandalone);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsStandalone(true);
    };
    mediaQuery.addEventListener?.('change', handleMediaChange);

    // 2. Nhận diện thiết bị (iPhone, iPad, Android, hay Laptop Windows/Mac)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIPadOS =
      window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) || isIPadOS;
    const isAndroidDevice = /android/.test(ua);

    if (isIOSDevice) {
      setDeviceType('ios');
    } else if (isAndroidDevice) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // 3. Lắng nghe sự kiện beforeinstallprompt (Chrome / Edge / Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setShowGuideModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener?.('change', handleMediaChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Ẩn nút nếu ứng dụng đã được cài đặt (chạy ở chế độ Standalone)
  if (mounted && isStandalone) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
        return;
      } catch {
        // Nếu trình duyệt chặn hoặc lỗi, chuyển sang mở Modal hướng dẫn
      }
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="Cài đặt ứng dụng Đọc Hiểu Tiếng Việt lên thiết bị"
        aria-label="Cài đặt ứng dụng"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0066ab] border border-sky-200 transition-all text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer active:scale-95 shadow-2xs"
      >
        <Download className="w-3.5 h-3.5 text-[#0066ab] shrink-0" />
        <span>Cài App</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0066ab] flex items-center justify-center shrink-0">
                  {deviceType === 'ios' ? (
                    <Smartphone className="w-5 h-5" />
                  ) : deviceType === 'android' ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    Cài đặt App Đọc Hiểu Tiếng Việt
                  </h3>
                  <p className="text-xs text-slate-500">
                    {deviceType === 'ios'
                      ? 'Hướng dẫn dành cho iPhone & iPad (Safari)'
                      : deviceType === 'android'
                      ? 'Hướng dẫn dành cho điện thoại Android'
                      : 'Hướng dẫn dành cho Laptop / Máy tính'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Đóng hướng dẫn"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung hướng dẫn theo thiết bị */}
            {deviceType === 'ios' ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0066ab] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      Nhấn nút Chia sẻ
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[#0066ab] text-xs font-bold">
                        <Share className="w-3.5 h-3.5" /> ⬆️
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Biểu tượng hình vuông có mũi tên hướng lên nằm ở thanh công cụ phía dưới (iPhone) hoặc phía trên (iPad) trình duyệt Safari.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      Chọn &ldquo;Thêm vào MH chính&rdquo;
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-700 text-xs font-bold">
                        <PlusSquare className="w-3.5 h-3.5" /> ➕
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cuộn danh sách xuống dưới, chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong> rồi bấm <strong>Thêm (Add)</strong> ở góc phải.
                    </p>
                  </div>
                </div>
              </div>
            ) : deviceType === 'android' ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0066ab] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-bold text-slate-900">
                      Mở Menu trình duyệt Chrome (biểu tượng ⋮)
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nhấn vào biểu tượng <strong>3 chấm dọc (⋮)</strong> ở góc trên bên phải thanh địa chỉ trình duyệt.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-bold text-slate-900">
                      Chọn &ldquo;Cài đặt ứng dụng&rdquo; hoặc &ldquo;Thêm vào Màn hình chính&rdquo;
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nhấn xác nhận <strong>Cài đặt (Install)</strong> để biểu tượng ứng dụng xuất hiện ngay trên màn hình điện thoại.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0066ab] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      Nhấn icon Cài đặt trên thanh địa chỉ URL
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[#0066ab] text-xs font-bold">
                        <Download className="w-3.5 h-3.5" /> 📥
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nhìn lên <strong>cuối thanh địa chỉ URL</strong> (bên phải, cạnh ngôi sao đánh dấu trang) trên Chrome hoặc Edge và nhấn biểu tượng màn hình có mũi tên tải xuống.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-bold text-slate-900">
                      Hoặc dùng Menu trình duyệt / Safari Mac
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • <strong>Chrome / Edge:</strong> Menu <strong>⋮</strong> ➔ <strong>Lưu và chia sẻ</strong> ➔ <strong>Cài đặt trang dưới dạng ứng dụng</strong>.<br />
                      • <strong>Safari (Mac):</strong> Menu <strong>Tệp (File)</strong> ➔ <strong>Thêm vào Dock (Add to Dock)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Mở nhanh toàn màn hình như ứng dụng thật
              </span>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0066ab] text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shrink-0"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

