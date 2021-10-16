import { useState } from 'react';

type Props = {
  error?: string;
  onEdit: (title: string, link: string) => void;
  onDelete: () => void;
  title?: string;
  link?: string;
};

export const SocialInput = (props: Props) => {
  const { error, onEdit, onDelete, title: oldTitle, link: oldLink } = props;
  const [title, setTitle] = useState(oldTitle ?? '');
  const [link, setLink] = useState(oldLink ?? '');

  return (
    <div
      style={{
        backgroundColor: 'white',
        margin: 10,
        overflowY: 'scroll',
      }}
    >
      <div
        style={{
          WebkitTextSizeAdjust: '100%',
          WebkitTapHighlightColor: 'transparent',
          lineHeight: '1.5',
          textAlign: 'left',
          color: '#0a0b0d',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          letterSpacing: 'normal',
          pointerEvents: 'all',
          WebkitFontSmoothing: 'antialiased',
          backfaceVisibility: 'hidden',
          flex: '1 1 0%',
          padding: '16px',
          height: '100%',
          position: 'relative',
          boxSizing: 'inherit',
        }}
      >
        <form
          style={{
            WebkitTextSizeAdjust: '100%',
            WebkitTapHighlightColor: 'transparent',
            lineHeight: '1.5',
            textAlign: 'left',
            color: '#0a0b0d',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            letterSpacing: 'normal',
            pointerEvents: 'all',
            WebkitFontSmoothing: 'antialiased',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            display: 'flex',
            boxSizing: 'inherit',
          }}
        >
          <div
            style={{
              WebkitTextSizeAdjust: '100%',
              WebkitTapHighlightColor: 'transparent',
              lineHeight: '1.5',
              textAlign: 'left',
              color: '#0a0b0d',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              letterSpacing: 'normal',
              pointerEvents: 'all',
              WebkitFontSmoothing: 'antialiased',
              flex: '1 1 0%',
              width: '100%',
              paddingRight: '12px',
              boxSizing: 'inherit',
            }}
          >
            <div
              style={{
                WebkitTextSizeAdjust: '100%',
                WebkitTapHighlightColor: 'transparent',
                lineHeight: '1.5',
                textAlign: 'left',
                color: '#0a0b0d',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                letterSpacing: 'normal',
                pointerEvents: 'all',
                WebkitFontSmoothing: 'antialiased',
                boxSizing: 'inherit',
              }}
            >
              <div
                style={{
                  WebkitTextSizeAdjust: '100%',
                  WebkitTapHighlightColor: 'transparent',
                  lineHeight: '1.5',
                  textAlign: 'left',
                  color: '#0a0b0d',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  letterSpacing: 'normal',
                  pointerEvents: 'all',
                  WebkitFontSmoothing: 'antialiased',
                  display: 'grid',
                  marginBottom: '4px',
                  width: '100%',
                  gridTemplateColumns: 'minmax(0px, 90%)',
                  justifyContent: 'left',
                  WebkitBoxAlign: 'baseline',
                  alignItems: 'baseline',
                  boxSizing: 'inherit',
                }}
              >
                <div
                  style={{
                    WebkitTextSizeAdjust: '100%',
                    WebkitTapHighlightColor: 'transparent',
                    lineHeight: '1.5',
                    textAlign: 'left',
                    color: '#0a0b0d',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    letterSpacing: 'normal',
                    WebkitFontSmoothing: 'antialiased',
                    gridArea: '1 / 1 / auto / auto',
                    boxSizing: 'inherit',
                  }}
                >
                  <input
                    style={{
                      WebkitTextSizeAdjust: '100%',
                      WebkitTapHighlightColor: 'transparent',
                      WebkitFontSmoothing: 'antialiased',
                      overflow: 'visible',
                      backgroundColor: 'transparent',
                      backgroundImage: 'none',
                      borderRadius: '0px',
                      fontStyle: 'inherit',
                      fontVariant: 'inherit',
                      fontStretch: 'inherit',
                      lineHeight: 'inherit',
                      fontFamily: 'inherit',
                      appearance: 'none',
                      border: '2px',
                      borderColor: 'black',
                      color: 'rgb(61, 68, 75)',
                      width: '100%',
                      height: '20px',
                      margin: '0px',
                      padding: '0px',
                      fontSize: '14px',
                      boxSizing: 'inherit',
                    }}
                    type="text"
                    autoComplete="false"
                    name="hidden"
                    id="twitter"
                    placeholder={'Your title'}
                    value={title}
                    onChange={(evt) => {
                      setTitle(evt.target.value);
                      onEdit(evt.target.value, link);
                    }}
                  />
                  <input
                    style={{
                      WebkitTextSizeAdjust: '100%',
                      WebkitTapHighlightColor: 'transparent',
                      WebkitFontSmoothing: 'antialiased',
                      overflow: 'visible',
                      backgroundColor: 'transparent',
                      backgroundImage: 'none',
                      borderRadius: '0px',
                      fontStyle: 'inherit',
                      fontVariant: 'inherit',
                      fontStretch: 'inherit',
                      lineHeight: 'inherit',
                      fontFamily: 'inherit',
                      appearance: 'none',
                      border: '0px',
                      color: 'rgb(61, 68, 75)',
                      width: '100%',
                      height: '20px',
                      margin: '0px',
                      padding: '0px',
                      fontSize: '14px',
                      boxSizing: 'inherit',
                    }}
                    type="text"
                    autoComplete="false"
                    name="hidden"
                    id="twitter"
                    placeholder="Your link goes here"
                    value={link}
                    onChange={(evt) => {
                      setLink(evt.target.value);
                      onEdit(title, evt.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        <div
          style={{
            cursor: 'pointer',
          }}
          onClick={onDelete}
        >
          Delete
        </div>
      </div>
      {error && (
        <div
          style={{
            color: 'red',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
