import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IoAddOutline, IoLinkOutline } from "react-icons/io5";
import { Fragment } from "react/jsx-runtime";
import { useEffect } from "react";

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  stages?: Array<Stage>;
}

const emptyStage: Stage = {
  text: "",
  sight_link: "",
};

const defaultValue: Array<Stage> = [emptyStage, emptyStage];

const LinkInputElement = ({ link }: { link: string }) => {
  return (
    <input
      defaultValue={link}
      type="text"
      size={10}
      className="stage-link form-control text-primary"
      placeholder="Sight id"
      //   pattern="${idRegExp}"
      //   title="${idRegExpTitle}"
      required
    />
  );
};

export const StagesField: React.FC<Props> = ({
  register,
  setValue,
  stages = defaultValue,
}) => {
  useEffect(() => {
    register("stages");
    setValue("stages", defaultValue);
  }, []);

  const addStage = () => {
    stages.push(emptyStage);

    setValue("stages", stages);
  };

  //   const setLink = (index: number) => {
  //     console.log(stages);
  //     if (stages[index].sight_link !== "") {
  //       stages[index].sight_link = "";
  //     } else {
  //       stages[index].sight_link = " ";
  //     }

  //     setValue("stages", stages);
  //   };

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
                  className="form-control"
                  maxLength={55}
                  required
                />
                <IoLinkOutline
                  className={`stage-input-icon ${
                    stage.sight_link !== "" ? "active" : ""
                  }`}
                  //   onClick={() => setLink(index)}
                />
              </div>
              {stage.sight_link !== "" && <LinkInputElement link={stage.sight_link} />}
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
