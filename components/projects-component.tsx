import { Box, Button, Grid, Heading, Layer } from "grommet";
import React from "react";
import { getProject } from "../pages/util";

interface IProps {
  projects: any;
  comments: any;
}

type ProjectAndComments = {
  project: any;
  comments: any[];
};

type ProjectsById = {
  [id: number]: ProjectAndComments;
};

type ProjectDetails = {
  id: number;
  details: any;
};

const ProjectsComponent = (props: IProps) => {
  const { projects, comments } = props;
  const projectsById: ProjectsById = projects.reduce((acc, val, index) => {
    acc[val.id] = { project: val, comments: comments[index].comments };
    return acc;
  }, {});

  const [
    commentsOpenForProjectId,
    setCommentsOpenForProjectId,
  ] = React.useState(undefined);

  const [projectDetailsOpenForId, setProjectDetailsOpenForId] = React.useState(
    undefined as ProjectDetails
  );

  const closeComment = () => setCommentsOpenForProjectId(undefined);
  const closeDescription = () => setProjectDetailsOpenForId(undefined);

  return (
    <Grid
      columns={{
        count: 3,
        size: "auto",
      }}
      gap="small"
    >
      {projects.map((project, i) => (
        <Box
          gap="small"
          direction="column"
          justify="center"
          pad="medium"
          elevation="small"
          key={`project_${i}`}
        >
          <Heading level="3">{project.name}</Heading>
          <img
            style={{ display: "block", width: "270px", height: "270px" }}
            src={project.covers["202"]}
          />
          <div>
            <Button
              margin={{ right: "small" }}
              primary
              onClick={async () => {
                const detailedProjectResult = await getProject(project.id);
                setProjectDetailsOpenForId({
                  details: detailedProjectResult,
                  id: project.id,
                });
              }}
              label="Description"
            />
            <Button
              onClick={() => {
                setCommentsOpenForProjectId(project.id);
              }}
              label="Comments"
            />
          </div>
        </Box>
      ))}
      {projectDetailsOpenForId && (
        <Layer
          position="center"
          modal
          onClickOutside={closeDescription}
          onEsc={closeDescription}
        >
          <Box pad="medium" flex overflow="auto">
            <Heading level="3">
              Say hi to {projectsById[projectDetailsOpenForId.id].project.name}
            </Heading>
            <div>{projectDetailsOpenForId.details.description}</div>
          </Box>
        </Layer>
      )}
      {commentsOpenForProjectId && (
        <Layer
          position="center"
          modal
          onClickOutside={closeComment}
          onEsc={closeComment}
        >
          <Box pad="medium" flex overflow="auto">
            <Heading level="3">
              Comments about{" "}
              {projectsById[commentsOpenForProjectId].project.name}
            </Heading>
            <div>
              {projectsById[commentsOpenForProjectId].comments.map(
                (comment, j) => (
                  <div key={`comment_${j}`}>
                    <strong>{comment.user.first_name} said </strong>
                    {comment.comment}
                    <hr />
                  </div>
                )
              )}
            </div>
          </Box>
        </Layer>
      )}
    </Grid>
  );
};

export default ProjectsComponent;
