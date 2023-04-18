import React from 'react'

export default function OptionWithImage({ image, title, callBack }) {
  return (
    <div
      className='optWImage'
      onClick={() => { callBack() }}
    >
      <img src={image} width="25" height="25" />
      <span>{title}</span>
    </div>
  )
}
