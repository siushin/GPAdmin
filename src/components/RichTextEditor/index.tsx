// @ts-expect-error
import CharacterCount from '@tiptap/extension-character-count';
// @ts-expect-error
import Placeholder from '@tiptap/extension-placeholder';
// @ts-expect-error
import { EditorContent, useEditor } from '@tiptap/react';
// @ts-expect-error
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback, useEffect, useRef } from 'react';
import './index.less';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  maxLength,
  disabled = false,
}) => {
  // 使用 ref 来跟踪是否正在更新，避免循环引用
  const isUpdatingRef = useRef(false);
  const lastValueRef = useRef<string | undefined>(value);
  const onChangeRef = useRef(onChange);

  // 保持 onChange 引用最新
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      ...(maxLength ? [CharacterCount.configure({ limit: maxLength })] : []),
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // 如果正在更新，不触发 onChange，避免循环引用
      if (isUpdatingRef.current) {
        return;
      }
      const html = editor.getHTML();
      // 只有当内容真正改变时才触发 onChange
      if (html !== lastValueRef.current && html !== value) {
        lastValueRef.current = html;
        onChangeRef.current?.(html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML();
      // 只有当值真正改变时才更新，避免循环引用
      if (value !== currentContent && value !== lastValueRef.current) {
        isUpdatingRef.current = true;
        lastValueRef.current = value;
        // 使用 requestAnimationFrame 确保在下一个渲染周期重置标志
        requestAnimationFrame(() => {
          editor.commands.setContent(value, false);
          requestAnimationFrame(() => {
            isUpdatingRef.current = false;
          });
        });
      }
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount?.characters() || 0;

  return (
    <div className="rich-text-editor">
      {!disabled && (
        <div className="rich-text-editor-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <s>S</s>
          </button>
          <div className="divider" />
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
            }
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
            }
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
            }
          >
            H3
          </button>
          <div className="divider" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            • 列表
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            1. 列表
          </button>
          <div className="divider" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            "
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            ─
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            撤销
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            重做
          </button>
        </div>
      )}
      <div className="rich-text-editor-content">
        <EditorContent editor={editor} />
      </div>
      {maxLength && (
        <div className="rich-text-editor-footer">
          <span className="character-count">
            {characterCount} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
