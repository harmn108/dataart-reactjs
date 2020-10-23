import React, { useState, useEffect, createRef } from "react";
import { Form, Formik, useField, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import ReactTags from "react-tag-autocomplete";
import axios from "axios";
import * as Yup from "yup";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const EditNotice = (props) => {
  const [noticeData, setNoticeData] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedNoticeId =
    props.match && props.match.params && props.match.params.id
      ? parseInt(props.match.params.id, 10)
      : 0;

  const history = useHistory();
  const reactTags = createRef();

  useEffect(() => {
    if (selectedNoticeId) {
      getNoticeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeChange = (path) => {
    history.push(path);
  };

  const getNoticeData = () => {
    axios
      .get("http://localhost:3001/notices")
      .then((res) => {
        if (res.data && res.data.length) {
          const allTagsData = [];
          const noticeDataArray = res.data.filter((notice) => {
            if (notice.tags) {
              notice.tags.forEach((name, index) => {
                if (!allTagsData.some((item) => item.name === name)) {
                  allTagsData.push({ id: index + 1, name: name });
                }
              });
            }
            return notice.id === selectedNoticeId;
          });
          setAllTags(allTagsData);
          setNoticeData(
            noticeDataArray && noticeDataArray[0] ? noticeDataArray[0] : null
          );
          setNoticeData((state) => {
            if (state.tags) {
              const tagsData = [];
              state.tags.forEach((data, index) => {
                tagsData.push({
                  id: index + 1,
                  name: data,
                });
              });
              setTags(tagsData);
            }
            setLoading(false);
            return state;
          });
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const updateNotice = (title, description, tags, resetForm, setSubmitting) => {
    axios
      .put("http://localhost:3001/notices/" + noticeData.id, {
        id: noticeData.id,
        directoryId: noticeData.directoryId,
        position: noticeData.position,
        title: title,
        description: description,
        tags: tags,
      })
      .then((result) => {
        setNoticeData(result.data);
        routeChange("/directories/" + noticeData.directoryId);
      });
  };

  const onDelete = (i, setFieldValue) => {
    const tagsList = tags.slice(0);
    tagsList.splice(i, 1);
    setTags(tagsList);
    setFieldValue(
      "tags",
      tagsList.map((item) => item.name)
    );
  };

  const onAddition = (tag, setFieldValue) => {
    if (!tags.some((item) => item.name === tag.name)) {
      const tagsList = [].concat(tags, tag);
      setTags(tagsList);
      setFieldValue(
        "tags",
        tagsList.map((item) => item.name)
      );
    }
  };

  return (
    <div>
      {!loading ? (
        <Formik
          initialValues={{
            title: noticeData.title,
            description: noticeData.description,
            tags: tags,
          }}
          validationSchema={Yup.object({
            title: Yup.string()
              .min(3, "Must be at least 3 characters")
              .required("Required"),
            description: Yup.string()
              .min(3, "Must be at least 3 characters")
              .required("Required"),
            tags: Yup.array().min(1, "Required"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const tagsList = values.tags.map((item) =>
              item && item.name ? item.name : item
            );
            updateNotice(
              values.title,
              values.description,
              tagsList,
              resetForm,
              setSubmitting
            );
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <h1>Edit Notice Number {noticeData.id}</h1>
              <CustomTextInput
                label="Title"
                type="text"
                name="title"
                placeholder="Title"
              />
              <CustomTextInput
                label="Description"
                type="text"
                name="description"
                placeholder="Description"
              />
              <ReactTags
                ref={reactTags}
                inputAttributes={{ name: "tags", label: "Tags" }}
                allowNew={true}
                inputFieldPosition="bottom"
                tags={tags}
                suggestions={allTags}
                onDelete={(i) => onDelete(i, setFieldValue)}
                onAddition={(tag) => onAddition(tag, setFieldValue)}
              />
              <ErrorMessage name="tags" />
              <button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Loading..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      ) : null}
    </div>
  );
};

export default EditNotice;
