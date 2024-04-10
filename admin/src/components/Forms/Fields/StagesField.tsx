import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IoAddOutline, IoLinkOutline } from "react-icons/io5";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { idValidation } from "../../../data/RegExpData";

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  stages?: Array<Stage>;
}

const emptyStage: Stage = {
  text: "",
  sight_link: "",
};

const defaultValue: Array<Stage> = [{ ...emptyStage }, { ...emptyStage }];

const LinkInputElement = ({ link }: { link: string }) => {
  return (
    <input
      defaultValue={link}
      type="text"
      size={10}
      className="stage-link form-control text-primary"
      placeholder="Sight id"
      required
      {...idValidation}
    />
  );
};

export const StagesField: React.FC<Props> = ({
  register,
  setValue,
  stages = defaultValue,
}) => {
  const [links, setLinks] = useState<Array<boolean>>([]);

  useEffect(() => {
    register("stages");
    setValue("stages", defaultValue);
  }, []);

  const addStage = () => {
    stages.push({ ...emptyStage });

    setValue("stages", [...stages]);
  };

  const toggleLink = (index: number) => {
    links[index] = !links[index];
    stages[index].sight_link = "";

    setLinks([...links]);
    setValue("stages", [...stages]);
  };

  const setStageTitle = (index: number, newTitle: string) => {
    stages[index].text = newTitle;

    setValue("stages", [...stages]);
  };

  const deleteInputIfEmpty = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && stages.length > 2 && stages[index].text === "") {
      e.preventDefault();
      stages.splice(index, 1);
      setValue("stages", [...stages]);
    }
  };

  return (
    <section className="col-12">
      <label className="form-label">Stages</label>
      <div id="stages" className="stages-container">
        {stages.map((stage, index) => {
          return (
            <Fragment key={index}>
              <div className="stage">
                <input
                  type="text"
                  size={stage.text.length}
                  value={stage.text}
                  className="form-control"
                  maxLength={55}
                  onChange={e => setStageTitle(index, e.currentTarget.value)}
                  onKeyDown={e => deleteInputIfEmpty(e, index)}
                  required
                />
                <IoLinkOutline
                  className={`stage-input-icon ${
                    stage.sight_link !== "" ? "active" : ""
                  }`}
                  onClick={() => toggleLink(index)}
                />
              </div>
              {(stage.sight_link !== "" || links[index] === true) && (
                <LinkInputElement link={stage.sight_link} />
              )}
              {index !== stages.length - 1 && "-"}
            </Fragment>
          );
        })}
        <button
          type="button"
          className="btn btn-icon text-primary"
          id="add-stage"
          onClick={addStage}
        >
          <IoAddOutline />
        </button>
      </div>
    </section>
  );
};
