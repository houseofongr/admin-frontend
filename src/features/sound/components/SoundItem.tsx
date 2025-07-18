import { BiDotsVerticalRounded } from "react-icons/bi";
import { convertUnixToDate } from "../../../utils/formatDate";
import { useEffect, useRef, useState } from "react";
import {
  RiDeleteBin6Line,
  RiFileDownloadLine,
  RiImageEditFill,
} from "react-icons/ri";
import { PiGpsBold } from "react-icons/pi";
import { TbMusic, TbPencilCog } from "react-icons/tb";
import ContextMenu from "../../../components/ContextMenu";
import SoundDetailModal from "./SoundDetailModal";
import { SoundType } from "../../../context/useSoundStore";
import AudioUploadModal from "../../../components/modal/AudioUploadModal";
import { MdOutlineAudioFile, MdOutlineSimCardDownload } from "react-icons/md";
import InfoEditModal from "../../../components/modal/InfoEditModal";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import {
  deleteSound,
  patchSoundEdit,
  patchSoundInfoEdit,
} from "../../../service/soundService";

interface SoundItemProps {
  index: number;
  soundData: SoundType;
  onUpdateSound: (soundId: number, newAudioId: number) => void;
  onUpdateSoundInfo: (
    soundId: number,
    title: string,
    description: string,
    hidden: boolean
  ) => void;
  onDeleteSound:(soundId:number) => void;
}

enum ModalType {
  SoundDetail,
  EditSound,
  EditInfo,
  DeleteSound,
}

const SoundItem: React.FC<SoundItemProps> = ({
  index,
  soundData,
  onUpdateSound,
  onUpdateSoundInfo,
  onDeleteSound
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showModal, setShowModal] = useState<ModalType | null>(null);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(
    null
  );

  // 메뉴와 아이템을 감지할 ref
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // 외부 클릭 감지용 useEffect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const ShowSoundDetailModal = () => {
    if (!menuOpen) {
      setShowModal(ModalType.SoundDetail);
    }
  };

  const ShowSoundEditModal = () => {
    setShowModal(ModalType.EditSound);
    setMenuOpen(false);
  };

  const handleSoundEditSubmit = async (file: File) => {
    var res = await patchSoundEdit(soundData.soundId, file);
    const { newAudioId } = res;
    setShowModal(null);
    onUpdateSound(soundData.soundId, newAudioId);
    setAlert({
      text: "변경사항이 저장되었습니다.",
      type: "success",
    });

    setAlert({
      text: "오디오 수정이 완료되었습니다.",
      type: "success",
    });
  };

  const handleDownloadImage = () => {
    console.log("이미지 다운로드");
    setMenuOpen(false);
  };

  const ShowInfoEditModal = () => {
    setShowModal(ModalType.EditInfo);
    setMenuOpen(false);
  };


  const handleInfoEditSubmit = async (
    title: string,
    description: string,
    hidden: boolean
  ) => {
    const payload = { title, description, hidden };
    await patchSoundInfoEdit(soundData.soundId, payload);
    onUpdateSoundInfo(soundData.soundId, title, description, hidden); // 부모에 업데이트 알림

    setShowModal(null);
    setAlert({
      text: "변경사항이 저장되었습니다.",
      type: "success",
    });
  };

  const ShowSoundDeleteModal = () => {
    setShowModal(ModalType.DeleteSound);
    setMenuOpen(false);
  };

  const handleSoundDeleteSubmit = async () => {
    await deleteSound(soundData.soundId);
    onDeleteSound(soundData.soundId); // 부모에 업데이트 알림

    setShowModal(null);
    setAlert({
      text: "사운드가 삭제되었습니다.",
      type: "success",
    });
  };


  const menuItems = [
    {
      label: "오디오 수정",
      icon: <MdOutlineAudioFile size={20} />,
      onClick: () => ShowSoundEditModal(),
    },
    {
      label: "오디오 다운로드",
      icon: <MdOutlineSimCardDownload size={20} />,
      onClick: handleDownloadImage,
    },
    {
      label: "정보 수정",
      icon: <TbPencilCog size={20} />,
      onClick: ShowInfoEditModal,
    },
    {
      label: "사운드 삭제",
      icon: <RiDeleteBin6Line size={20} />,
      onClick: ShowSoundDeleteModal,
    },
  ];

  const handleClick = (e: React.MouseEvent) => {
    setMenuOpen(true);
    const rect = e.currentTarget.getBoundingClientRect();

    setMenuOpen(true);
    setMenuPosition({
      top: rect.bottom + 4, // 요소 아래에 위치
      left: rect.left - 180,
    });
  };

  return (
    <div
      key={index}
      onClick={ShowSoundDetailModal}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative overflow-visible"
    >
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => {
            setAlert(null);
            setShowModal(null);
          }}
          okButton={
            <Button
              label="확인"
              onClick={() => {
                setAlert(null);
                setShowModal(null);
              }}
            />
          }
        />
      )}
      <div className="flex flex-col items-start gap-2 border-b py-3 group text-white cursor-pointer hover:opacity-70 transition-all duration-200">
        {/* 트랙 번호 */}
        <div className="font-semibold text-primary">TRACK NO. {index + 1}</div>

        <div className="flex flex-row w-full">
          {/* 아이콘 */}
          <div className="mr-3">
            <TbMusic size={25} />
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 relative mb-2">
            <div className="text-sm font-semibold">{soundData.title}</div>
            <div className="text-xs mt-1 mr-5">{soundData.description}</div>
          </div>

          {/* 수정 아이콘 */}
          <div
            className="absolute top-2 right-0 transition-opacity duration-400 cursor-pointer"
            style={{ opacity: hoveredIndex === index ? 1 : 0 }}
            onClick={(e) => {
              e.stopPropagation(); // 부모 onClick 막기!
              // setMenuOpen(true);
              handleClick(e);
            }}
          >
            <BiDotsVerticalRounded size={20} />
          </div>

          {/* 날짜 */}
          <div className="text-[11px] absolute bottom-1 right-0">
            {convertUnixToDate(soundData.createdTime).default}
          </div>
        </div>
      </div>

      {/* ContextMenu 렌더링 */}
      {menuOpen && (
        <div ref={wrapperRef}>
          <ContextMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={menuItems}
            position={menuPosition}
            positionMode="fixed"
          />
        </div>
      )}
      {showModal == ModalType.SoundDetail && (
        <SoundDetailModal onClose={() => setShowModal(null)} data={soundData} />
      )}
      {showModal == ModalType.EditSound && (
        <AudioUploadModal
          onClose={() => setShowModal(null)}
          onConfirm={handleSoundEditSubmit}
          title="오디오 수정"
          description="선택한 오디오 파일을 수정합니다."
          labelText="수정할 오디오 파일을"
          subLabelText="사운드는 50MB 이하의 MP3, WAV 파일만 가능합니다."
          confirmText="저장"
          maxFileSizeMB={50}
        />
      )}
      {showModal == ModalType.EditInfo && (
        <InfoEditModal
          modalTitle="세부정보 수정"
          modalDescription="사운드의 세부 정보를 변경할 수 있습니다."
          initTitle={soundData.title ?? ""}
          initDescription={soundData.description ?? ""}
          initHidden={soundData.hidden}
          onClose={() => setShowModal(null)}
          handleSaveInfo={handleInfoEditSubmit}
        />
      )}
      {showModal == ModalType.DeleteSound && (
        <ModalAlertMessage
          text="정말로 사운드를 삭제하시겠습니까?"
          type="check"
          subText="* 관련된 음원이 삭제됩니다."
          onClose={() => setShowModal(null)}
          okButton={<Button label="확인" onClick={handleSoundDeleteSubmit} />}
          cancelButton={
            <Button
              label="취소"
              variant="gray"
              onClick={() => setShowModal(null)}
            />
          }
        />
      )}
    </div>
  );
};

export default SoundItem;
