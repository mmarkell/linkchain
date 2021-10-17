import { useState } from 'react';
import Image from 'next/image';

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
        fontFamily: 'Space Grotesk',
        backgroundColor: 'white',
        margin: 10,
        textAlign: 'left',
        fontSize: 16,
        padding: '16px',
        height: '100%',
        border: 'solid black 2px',
      }}
    >
      <div>
        <input
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0px',
            border: '2px',
            fontSize: '1.5rem',
            borderColor: 'black',
            width: '100%',
          }}
          type="text"
          autoComplete="false"
          name="hidden"
          id="Title"
          placeholder={'Your title'}
          value={title}
          onChange={(evt) => {
            setTitle(evt.target.value);
            onEdit(evt.target.value, link);
          }}
        />
        <input
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0px',
            border: '2px',
            fontSize: '1.5rem',
            borderColor: 'black',
            width: '100%',
          }}
          type="text"
          autoComplete="false"
          name="hidden"
          id="twitter"
          placeholder="Where to link?"
          value={link}
          onChange={(evt) => {
            setLink(evt.target.value);
            onEdit(title, evt.target.value);
          }}
        />
      </div>
      <div style={{ cursor: 'pointer', float: 'right' }}>
        <Image
          width={25}
          height={25}
          onClick={onDelete}
          src="/trashcan.png"
          alt="Delete"
        />
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
