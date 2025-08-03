import { Editor } from '@tinymce/tinymce-react';

export default function EditorComp({ Ref, height, defaultvalue }) {
    const apiKeyEditor = 'ml0itnuehc0elmw2o8frzbgx4f5ay8d8boebxam43paxdt4m';

    return (
        <>
            <Editor
                apiKey={apiKeyEditor}
                onInit={(evt, editor) => Ref.current = editor}
                initialValue={defaultvalue || ''}
                init={{
                    branding: false,
                    height: height || 200,
                    menubar: false,
                    plugins: [
                        "format", // <-- ajoute ça
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "wordcount",
                    ],
                    toolbar: "H1 | fontsizeselect | bold italic forecolor backcolor | image table | alignleft aligncenter alignright alignjustify | bullist numlist",
                    content_style: `
                        body {
                            font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
                            font-size: 16px;
                            color: #1f2937;
                        }
                        h1 {
                            font-size: 24px;
                            font-weight: 800;
                        }
                    `,
                }}
            />
        </>
    );
}
