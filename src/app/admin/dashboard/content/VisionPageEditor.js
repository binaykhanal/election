"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { CheckSquare, Video, Trash2, Plus } from "lucide-react";

const CkEditor = dynamic(() => import("@/components/editor/CkEditor"), {
  ssr: false,
});

const ICONS = {
  graduation: dynamic(() =>
    import("lucide-react").then((mod) => mod.GraduationCap),
  ),
  heart: dynamic(() => import("lucide-react").then((mod) => mod.Heart)),
  road: dynamic(() => import("react-icons/fa").then((mod) => mod.FaRoad)),
  briefcase: dynamic(() => import("lucide-react").then((mod) => mod.Briefcase)),
  leaf: dynamic(() => import("lucide-react").then((mod) => mod.Sprout)),
  mountain: dynamic(() => import("lucide-react").then((mod) => mod.Mountain)),
  map: dynamic(() => import("lucide-react").then((mod) => mod.Globe)),
  default: dynamic(() => import("lucide-react").then((mod) => mod.CheckSquare)),
};

export default function VisionPageEditor({ value, onChange }) {
  const defaultData = {
    title: "",
    subtitle: "",
    manifesto_header: "",
    manifesto_subtitle: "",
    vision_items: [],
    commitments: [],
    videos: [],
  };

  const [data, setData] = useState({
    ...defaultData,
    ...value,
  });

  const syncData = (newData) => {
    setData(newData);
    onChange?.(newData);
  };

  const addVideo = () => {
    const newData = {
      ...data,
      videos: [...(data.videos || []), { title: "", url: "" }],
    };
    syncData(newData);
  };

  const updateVideo = (index, field, val) => {
    const vids = [...data.videos];
    vids[index][field] = val;
    syncData({ ...data, videos: vids });
  };

  const removeVideo = (index) => {
    const vids = data.videos.filter((_, i) => i !== index);
    syncData({ ...data, videos: vids });
  };
  const updateVisionItem = (index, field, val) => {
    const items = [...data.vision_items];
    items[index][field] = val;
    setData({ ...data, vision_items: items });
    onChange?.({ ...data, vision_items: items });
  };

  const addVisionItem = () => {
    const items = [
      ...data.vision_items,
      { title: "", icon: "graduation", color: "bg-blue-500", points: [] },
    ];
    setData({ ...data, vision_items: items });
    onChange?.({ ...data, vision_items: items });
  };

  const addPoint = (index) => {
    const items = [...data.vision_items];
    items[index].points.push("");
    setData({ ...data, vision_items: items });
    onChange?.({ ...data, vision_items: items });
  };

  const updatePoint = (vIndex, pIndex, val) => {
    const items = [...data.vision_items];
    items[vIndex].points[pIndex] = val;
    setData({ ...data, vision_items: items });
    onChange?.({ ...data, vision_items: items });
  };

  const updateCommitment = (index, field, val) => {
    const commits = [...data.commitments];
    commits[index][field] = val;
    setData({ ...data, commitments: commits });
    onChange?.({ ...data, commitments: commits });
  };

  const addCommitment = () => {
    const commits = [...data.commitments, { value: "", text: "" }];
    setData({ ...data, commitments: commits });
    onChange?.({ ...data, commitments: commits });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-4 rounded border space-y-4">
        <input
          placeholder="Page Title"
          className="w-full border p-2 rounded"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <input
          placeholder="Subtitle"
          className="w-full border p-2 rounded"
          value={data.subtitle}
          onChange={(e) => setData({ ...data, subtitle: e.target.value })}
        />
      </div>

      {/* Manifesto Section */}
      <div className="bg-yellow-50 p-6 rounded border border-yellow-200 space-y-4">
        <h3 className="text-sm font-bold text-yellow-700 uppercase">
          Manifesto Section
        </h3>

        <input
          placeholder="Manifesto Header"
          className="w-full border p-2 rounded"
          value={data.manifesto_header}
          onChange={(e) =>
            syncData({ ...data, manifesto_header: e.target.value })
          }
        />

        <div className="bg-white rounded border">
          <CkEditor
            editorData={data.manifesto_subtitle}
            handleEditorChange={(val) =>
              syncData({ ...data, manifesto_subtitle: val })
            }
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-4">
        <h3 className="text-sm font-bold text-blue-600 uppercase flex items-center gap-2">
          <Video size={16} /> Campaign Videos / Interviews
        </h3>
        <div className="space-y-3">
          {(data.videos || []).map((vid, index) => (
            <div
              key={index}
              className="flex gap-2 bg-white p-2 rounded border shadow-sm"
            >
              <input
                placeholder="Video Title"
                className="flex-1 border p-2 rounded text-sm"
                value={vid.title}
                onChange={(e) => updateVideo(index, "title", e.target.value)}
              />
              <input
                placeholder="YouTube/Vimeo URL"
                className="flex-1 border p-2 rounded text-sm"
                value={vid.url}
                onChange={(e) => updateVideo(index, "url", e.target.value)}
              />
              <button
                onClick={() => removeVideo(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            onClick={addVideo}
            className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add Video
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase">
          Vision Cards
        </h3>
        {data.vision_items.map((item, index) => {
          const IconComponent = ICONS[item.icon] || ICONS.default;
          return (
            <div
              key={index}
              className="border p-4 rounded bg-gray-50 space-y-3"
            >
              <input
                placeholder="Vision Title"
                className="w-full border p-2 rounded"
                value={item.title}
                onChange={(e) =>
                  updateVisionItem(index, "title", e.target.value)
                }
              />

              {/* Icon selector */}
              <div className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-gray-700" />
                <select
                  className="border p-2 rounded flex-1"
                  value={item.icon}
                  onChange={(e) =>
                    updateVisionItem(index, "icon", e.target.value)
                  }
                >
                  {Object.keys(ICONS).map((k) => (
                    <option key={k} value={k}>
                      {k.charAt(0).toUpperCase() + k.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <input
                placeholder="Tailwind Color (bg-blue-500)"
                className="w-full border p-2 rounded"
                value={item.color}
                onChange={(e) =>
                  updateVisionItem(index, "color", e.target.value)
                }
              />

              <div className="space-y-2">
                {item.points.map((point, pIndex) => (
                  <input
                    key={pIndex}
                    placeholder="Point"
                    className="w-full border p-2 rounded"
                    value={point}
                    onChange={(e) => updatePoint(index, pIndex, e.target.value)}
                  />
                ))}
                <button
                  onClick={() => addPoint(index)}
                  className="text-xs bg-gray-900 text-white px-3 py-1 rounded"
                >
                  + Add Point
                </button>
              </div>
            </div>
          );
        })}
        <button
          onClick={addVisionItem}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          + Add Vision
        </button>
      </div>

      {/* Commitments */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase">
          Commitments
        </h3>
        {data.commitments.map((item, index) => (
          <div key={index} className="border p-4 rounded bg-gray-50 space-y-3">
            <input
              placeholder="Value (100%)"
              className="w-full border p-2 rounded"
              value={item.value}
              onChange={(e) => updateCommitment(index, "value", e.target.value)}
            />
            <input
              placeholder="Text"
              className="w-full border p-2 rounded"
              value={item.text}
              onChange={(e) => updateCommitment(index, "text", e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addCommitment}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          + Add Commitment
        </button>
      </div>
    </div>
  );
}
