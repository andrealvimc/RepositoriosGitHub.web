/* eslint-disable react/prop-types */
/* eslint-disable react/sort-comp */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import PropsType from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { Loading, Owner, IssuesList } from './styles';
import Container from '../../components/Container/index';

export default class Repository extends Component {
  static propsType = {
    match: PropsType.shape({
      params: PropsType.shape({
        repository: PropsType.string
      })
    }).isRequired
  };

  state = {
    repository: {},
    issues: [],
    loading: true
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5
        }
      })
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos Repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }
}
