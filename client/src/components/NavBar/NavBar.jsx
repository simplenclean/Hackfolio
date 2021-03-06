/* eslint-disable import/first */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// Grommet Imports
import {
  Header,
  Box,
  TextInput,
  Button,
  Form,
  FormField,
  Menu,
  Anchor
} from 'grommet';

// Grommet Icons
import {
  UserIcon,
  SearchIcon,
  LoginIcon,
  LogoutIcon,
  MultipleIcon,
} from 'grommet/components/icons/base';

// Custom Imports
import Notifications from './Notifications';
import Modal from './Modal';
import * as UserAction from './../../actions/UserActions';
import { getProfile } from './../../actions/ProfileActions';

// Custom Styles
import './../../styles/NavBar.scss';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      modalState: true,
    };
    this.searchHandler = this.searchHandler.bind(this);
    this.sendSearch = this.sendSearch.bind(this);
    this.goProfile = this.goProfile.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  searchHandler(e) {
    this.setState({ searchText: e.target.value });
  }

  sendSearch(e) {
    e.preventDefault();
    const temp = this.state.searchText;
    this.props.search(temp);
    this.setState({ searchText: '' });
  }

  goProfile() {
    const user = this.props.user.username;
    this.props.goToProfile(user);
  }

  toggleModal() {
    this.props.startError();
    const temp = this.state.modalState;
    this.setState({ modalState: !temp });
  }

  render() {
    return (
      <div className="NavBar">
        <Header style={{ marginBottom: 22 }}>
          <Box
            flex
            justify="between"
            align="center"
            direction="row"
            responsive
            colorIndex="brand"
            pad={{ vertical: 'medium', horizontal: 'small' }}
          >
            <Box id="tabs" flex justify="start" align="center" direction="row">
              <Box
                style={{ fontSize: 28, fontWeight: 'bold', margin: '0 15px' }}
                direction="row"
                onClick={this.props.goToHome}
              >
                <Box justify="center">{this.props.user.username && <Notifications />}</Box>
                <Box justify="center">Hackfolio</Box>
              </Box>
              <Button
                icon={<MultipleIcon />}
                label="Bounty Board"
                plain
                onClick={this.props.goToHome}
              />
              {this.props.user.username && (
                <Menu
                  label={
                    <div style={{ marginBottom: -3 }}>
                      <UserIcon style={{ marginBottom: -6, marginRight: 6 }} /> Profile
                    </div>
                  }
                  icon=" "
                >
                  <Anchor onClick={this.goProfile} label="Your Profile" />
                  <Anchor onClick={this.props.goToConversations} label="Your Conversations" />
                  <Anchor onClick={this.props.goToFave} label="Your Favorite Bounties" />
                </Menu>
              )}
            </Box>
            <Box separator="all" direction="row" primary={false}>
              <Form onSubmit={this.sendSearch} compact>
                <Box direction="row">
                  <FormField className="SearchInput">
                    <TextInput
                      placeHolder="Search"
                      onDOMChange={this.searchHandler}
                      value={this.state.searchText}
                    />
                  </FormField>
                  <Button className="SearchIcon" icon={<SearchIcon />} type="submit" plain />
                </Box>
              </Form>
            </Box>
            <Box>
              {this.props.user === undefined || this.props.user.jwt === undefined ? (
                <Button label="Login" plain icon={<LoginIcon />} onClick={this.toggleModal} />
              ) : (
                <Button label="Logout" plain icon={<LogoutIcon />} onClick={this.props.logout} />
              )}
            </Box>
          </Box>
        </Header>
        <Modal func={this.toggleModal} hide={this.state.modalState} />
      </div>
    );
  }
}

NavBar.defaultProps = {
  user: {},
};

NavBar.propTypes = {
  user: PropTypes.shape({ jwt: PropTypes.string, username: PropTypes.string }),
  search: PropTypes.func.isRequired,
  goToHome: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  goToFave: PropTypes.func.isRequired,
  goToConversations: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  startError: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    help: state.help,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    search: text => {
      dispatch(UserAction.search(text));
      dispatch(push('/search'));
    },
    goToHome: () => dispatch(push('/')),
    goToProfile: user => {
      dispatch(getProfile(user));
      dispatch(push(`/user/${user}`));
    },
    goToFave: () => dispatch(push('/FavoriteBounties')),
    goToConversations: () => dispatch(push('/Conversations')),
    logout: () => dispatch(UserAction.logout()),
    startError: () => dispatch(UserAction.startError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
