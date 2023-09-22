import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { openModal } from 'mastodon/actions/modal';
import { version, source_url, profile_directory as profileDirectory } from 'mastodon/initial_state';
import { PERMISSION_INVITE_USERS } from 'mastodon/permissions';
import { logOut } from 'mastodon/utils/log_out';

const messages = defineMessages({
  logoutMessage: { id: 'confirmations.logout.message', defaultMessage: 'Are you sure you want to log out?' },
  logoutConfirm: { id: 'confirmations.logout.confirm', defaultMessage: 'Log out' },
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  onLogout () {
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: intl.formatMessage(messages.logoutMessage),
        confirm: intl.formatMessage(messages.logoutConfirm),
        closeWhenConfirm: false,
        onConfirm: () => logOut(),
      },
    }));
  },
});

class LinkFooter extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    multiColumn: PropTypes.bool,
    onLogout: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleLogoutClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onLogout();

    return false;
  };

  render () {
    const { signedIn, permissions } = this.context.identity;

    const canInvite = signedIn && ((permissions & PERMISSION_INVITE_USERS) === PERMISSION_INVITE_USERS);
    const canProfileDirectory = profileDirectory;

    return (
      <div className='link-footer'>
        <p>
          <Link key='about' to='/about'><FormattedMessage id='footer.about' defaultMessage='About' /></Link>
          {canInvite && (
            <>
              {' · '}
              <a key='invites' href='/invites' target='_blank'><FormattedMessage id='footer.invite' defaultMessage='Invite people' /></a>
            </>
          )}
          {canProfileDirectory && (
            <>
              {' · '}
              <Link key='directory' to='/directory'><FormattedMessage id='footer.directory' defaultMessage='Profiles directory' /></Link>
            </>
          )}
          {' · '}
          <Link key='privacy-policy' to='/privacy-policy'><FormattedMessage id='footer.privacy_policy' defaultMessage='Privacy policy' /></Link>
        </p>

        <p>
          <a href='https://joinmastodon.org/apps' target='_blank'><FormattedMessage id='footer.get_app' defaultMessage='Get the app' /></a>
          {' · '}
          <Link to='/keyboard-shortcuts'><FormattedMessage id='footer.keyboard_shortcuts' defaultMessage='Keyboard shortcuts' /></Link>
          {' · '}
          <a href={source_url} rel='noopener noreferrer' target='_blank'>v{version}</a>
        </p>
      </div>
    );
  }

}

export default injectIntl(connect(null, mapDispatchToProps)(LinkFooter));
