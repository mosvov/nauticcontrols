"use client";

import { analyticsConfig, hasMeta } from "lib/analytics";
import { ensureMetaStub } from "lib/analytics/meta";
import Script from "next/script";
import { useEffect } from "react";

function isValidPixelId(id: string): boolean {
  return /^\d{5,20}$/.test(id);
}

export function MetaPixel() {
  const pixelId = analyticsConfig.metaPixelId;
  if (!hasMeta() || !isValidPixelId(pixelId)) return null;

  return <MetaPixelScripts pixelId={pixelId} />;
}

function MetaPixelScripts({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    ensureMetaStub();
    window.fbq?.("init", pixelId);
  }, [pixelId]);

  return (
    <>
      <Script
        id="meta-pixel-stub"
        strategy="beforeInteractive"
      >{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document);
fbq('init','${pixelId}');
`}</Script>
      <Script
        id="meta-pixel"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
