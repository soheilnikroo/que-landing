import type { ReactNode, Ref } from 'react'

import type { DeviceMockupVariant } from '@/lib/device/detect-device'

import './device-frames.css'

type DeviceFrameProps = {
  variant: DeviceMockupVariant
  act: 'customer' | 'waiter' | 'transition'
  caption?: string
  screenRef?: Ref<HTMLDivElement>
  children: ReactNode
}

export function DeviceFrame({ variant, act, caption, screenRef, children }: DeviceFrameProps) {
  const isTablet = variant === 'android-tablet' || variant === 'ipad'

  return (
    <div
      className={`device-frame device-frame--${variant} device-frame--act-${act}${isTablet ? ' device-frame--tablet' : ''}`}
      data-device={variant}
      data-act={act}
    >
      {variant === 'iphone' || variant === 'ipad' ? (
        <>
          <div className="device-frame__island" aria-hidden="true" />
          <div className="device-frame__status device-frame__status--ios" aria-hidden="true">
            <span>۹:۴۱</span>
            <span className="device-frame__status-icons" />
          </div>
        </>
      ) : (
        <>
          <div className="device-frame__camera-punch" aria-hidden="true" />
          <div className="device-frame__status device-frame__status--android" aria-hidden="true">
            <span>۹:۴۱</span>
            <span className="device-frame__status-icons" />
          </div>
        </>
      )}

      <div ref={screenRef} className="device-frame__screen">
        {children}
      </div>

      {variant === 'android-phone' || variant === 'android-tablet' ? (
        <div className="device-frame__nav-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      ) : (
        <div className="device-frame__home-indicator" aria-hidden="true" />
      )}

      {caption ? <p className="device-frame__caption">{caption}</p> : null}
    </div>
  )
}
