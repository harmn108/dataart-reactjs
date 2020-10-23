import React, { useState, useEffect, createRef } from "react";
import { Form, Formik, useField, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import ReactTags from "react-tag-autocomplete";
import axios from "axios";
import * as Yup from "yup";
import * as queryString from "query-string";

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

const AddNotice = (props) => {
  const search = props.location.search;
  const queryStringData = queryString.parse(search);
  const directoryId =
    queryStringData && queryStringData.directoryId
      ? parseInt(queryStringData.directoryId, 10)
      : 0;
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const reactTags = createRef();

  useEffect(() => {
    if (directoryId) {
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
          res.data.forEach((notice) => {
            if (notice.tags) {
              notice.tags.forEach((name, index) => {
                if (!allTagsData.some((item) => item.name === name)) {
                  allTagsData.push({ id: index + 1, name: name });
                }
              });
            }
          });
          setAllTags(allTagsData);
          setAllTags((state) => {
            setLoading(false);
            return state;
          });
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const addNotice = (title, description, tags) => {
    axios
      .post("http://localhost:3001/notices", {
        directoryId,
        title,
        description,
        tags,
      })
      .then((res) => {
        routeChange("/directories/" + directoryId);
      })
      .catch((error) => {
        console.log("error:", error);
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
            title: "",
            description: "",
            tags: [],
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
            addNotice(values.title, values.description, tagsList);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <h1>Add Notice</h1>
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

export default AddNotice;
