import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { RepositoryShape } from "../../proptypes";
import actions from "../../actions";
import selectors from "../../selectors";

export const Repositories = ({ fetchRepositories, repositories }) => {
  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  const items = repositories.map(repository => (
    <li key={repository.id}>{repository.name}</li>
  ));
  return (
    <div>
      <h4>Repositories</h4>
      <ul>{items}</ul>
    </div>
  );
};

Repositories.propTypes = {
  fetchRepositories: PropTypes.func.isRequired,
  repositories: PropTypes.arrayOf(RepositoryShape).isRequired
};

const mapStateToProps = (state, props) => {
  return {
    repositories: selectors.repositories.get(state, props)
  };
};

const mapDispatchToProps = {
  fetchRepositories: actions.repositories.fetchRepositories
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repositories);
