import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { openModal } from 'mastodon/actions/modal';
import { identityContextPropShape, withIdentity } from 'mastodon/identity_context';
import { domain, version, source_url, statusPageUrl, profile_directory as profileDirectory } from 'mastodon/initial_state';
import { PERMISSION_INVITE_USERS } from 'mastodon/permissions';

const mapDispatchToProps = (dispatch) => ({
  onLogout () {
    dispatch(openModal({ modalType: 'CONFIRM_LOG_OUT' }));

  },
});

class LinkFooter extends PureComponent {
  static propTypes = {
    identity: identityContextPropShape,
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
    const { signedIn, permissions } = this.props.identity;
    const { multiColumn } = this.props;

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

export default injectIntl(withIdentity(connect(null, mapDispatchToProps)(LinkFooter)));
