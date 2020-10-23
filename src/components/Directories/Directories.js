import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { listToTree } from "../../utils/Utils";
import "./Directories.css";
import styled from "styled-components";
import { Treebeard, decorators } from "react-treebeard";
import axios from "axios";

const Container = styled.div``;

const Directories = (props) => {
  const [pureData, setPureData] = useState([]);
  const [data, setData] = useState(null);
  const [cursor, setCursor] = useState(false);

  const history = useHistory();

  useEffect(() => {
    loadDirectoriesTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeChange = (path) => {
    history.push(path);
  };

  const loadDirectoriesTree = () => {
    axios
      .get("http://localhost:3001/directories")
      .then((res) => {
        setPureData(res.data);
        setData(Object.assign({}, listToTree(res.data)));
        if (props.selectedDirectoryId) {
          const selectedDictionary = res.data.filter(
            (f) => f.id === Number.parseInt(props.selectedDirectoryId, 10)
          );
          if (selectedDictionary.length) {
            props.onChange(selectedDictionary[0].id);
          }
        } else {
          props.onChange(res.data[0].id);
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const addDictionary = (parentId, name = "New Folder") => {
    axios
      .post("http://localhost:3001/directories", { parentId, name })
      .then((res) => {
        setPureData([...pureData, res.data]);
        setPureData((state) => {
          setData(Object.assign({}, listToTree(state)));
          return state;
        });
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const updateDictionaryName = (node, e) => {
    const value = e.target.value;
    axios
      .put("http://localhost:3001/directories/" + node.id, {
        id: node.id,
        parentId: node.parentId,
        name: value,
      })
      .then((res) => {
        const newPureData = pureData.map((item) => {
          if (item.id === node.id) {
            item.name = value;
            item.editMode = false;
          }
          return item;
        });
        setPureData(newPureData);
        setPureData((state) => {
          setData(Object.assign({}, listToTree(state)));
          return state;
        });
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const deleteDictionary = (id) => {
    axios
      .delete("http://localhost:3001/directories/" + id)
      .then((res) => {
        let filteredData = pureData;
        filteredData = deleteNodeFromData(filteredData, id);
        setPureData(filteredData);
        setPureData((state) => {
          setData(Object.assign({}, listToTree(state)));
          return state;
        });
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const deleteNodeFromData = (data, id) => {
    data.forEach((item, index) => {
      if (item && item.children !== null) {
        item.children = item.children.filter((f) => f.id !== id);
      }
      if (
        item.id === id ||
        item.parentId === id ||
        (item.parentId && !data.filter((i) => i.id === item.parentId).length)
      ) {
        delete data[index];
      }
    });
    return data.filter((n) => n);
  };

  decorators.Header = ({ node, style, prefix }) => {
    const iconType =
      node.toggled && node.children && node.children.length
        ? "folder-open"
        : "folder";
    const iconClass = `fa fa-${iconType} fa-2x`;
    const iconStyle = { marginRight: "5px" };
    return (
      <div style={style.base}>
        <div style={{ ...style.title }}>
          <i className={iconClass} style={iconStyle} />
          {node.editMode ? null : <span>{node.name}</span>}
        </div>
      </div>
    );
  };

  class CutomContainer extends decorators.Container {
    _handleKeyDown = (e, node) => {
      if (e.key === "Enter") {
        updateDictionaryName(node, e);
      }
    };

    editModeSwitcher = (node) => {
      let filteredData = pureData.slice();
      filteredData.forEach((item) =>
        node.id !== item.id
          ? (item.editMode = false)
          : (item.editMode = !node.editMode)
      );
      setPureData(filteredData);
      setPureData((state) => {
        setData(Object.assign({}, listToTree(state)));
        return state;
      });
    };

    addNewItem = (node) => {
      addDictionary(node.id);
    };

    deleteItem = (node) => {
      deleteDictionary(node.id);
    };
    render() {
      const { style, decorators, onClick, node } = this.props;
      const classes = ["directory-list-item"];
      if (
        (node.active && node.parentId) ||
        node.id === Number.parseInt(props.selectedDirectoryId, 10)
      ) {
        classes.push("active");
      }
      return (
        <>
          <span
            className={classes.join(" ")}
            onClick={onClick}
            ref={(ref) => (this.clickableRef = ref)}
            // style={style.container[0]}
          >
            <decorators.Header node={node} style={style.header} />
            <span>
              {node.editMode ? null : (
                <>
                  <i
                    className="fa fa-plus pointer"
                    aria-hidden="true"
                    onClick={() => this.addNewItem(node)}
                  ></i>
                  <i
                    className="fa fa-pencil pointer"
                    aria-hidden="true"
                    onClick={() => this.editModeSwitcher(node)}
                  ></i>
                  <i
                    className="fa fa-trash pointer"
                    aria-hidden="true"
                    onClick={() => this.deleteItem(node)}
                  ></i>
                </>
              )}
              <input
                className={node.editMode ? "edit" : "hidden"}
                type="text"
                defaultValue={node.name}
                onKeyDown={(e) => this._handleKeyDown(e, node)}
              />
            </span>
          </span>
        </>
      );
    }
  }

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    props.onChange(node.id);
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data));
    routeChange("/directories/" + node.id);
  };

  const defaultStyles = {
    style: {
      tree: {
        base: {
          listStyle: "none",
          backgroundColor: "white",
          margin: 0,
          color: "#9DA5AB",
          fontFamily: "lucida grande ,tahoma,verdana,arial,sans-serif",
          fontSize: "14px",
          padding: "24px",
        },
        node: {
          base: {
            position: "relative",
            color: "green",
          },
          link: {
            cursor: "pointer",
            position: "relative",
            padding: "0px 5px",
            display: "block",
          },
          activeLink: {
            background: "#31363F",
          },
          toggle: {
            base: {
              position: "relative",
              display: "inline-block",
              verticalAlign: "top",
              marginLeft: "-5px",
              height: "24px",
              width: "24px",
            },
            wrapper: {
              position: "absolute",
              top: "50%",
              left: "50%",
              margin: "-7px 0 0 -7px",
              height: "14px",
            },
            height: 14,
            width: 14,
            arrow: {
              fill: "#9DA5AB",
              strokeWidth: 0,
            },
          },
          header: {
            base: {
              display: "inline-block",
              verticalAlign: "top",
              color: "#000",
            },
            connector: {
              width: "2px",
              height: "12px",
              position: "absolute",
              top: "0px",
              left: "-21px",
            },
            title: {
              lineHeight: "24px",
              verticalAlign: "middle",
            },
          },
          subtree: {
            listStyle: "none",
            paddingLeft: "19px",
          },
          loading: {
            color: "#E2C089",
          },
        },
      },
    },
  };

  decorators.Container = CutomContainer;

  let directoriesBlock = "Loading...";
  if (data) {
    directoriesBlock = (
      <Treebeard
        data={data}
        onToggle={onToggle}
        decorators={decorators}
        style={defaultStyles.style}
        onClick={(event) => console.log(event)}
      />
    );
  }
  return <Container>{directoriesBlock}</Container>;
};

export default Directories;
