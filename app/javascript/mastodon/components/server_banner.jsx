import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { fetchServer } from 'mastodon/actions/server';
import { ServerHeroImage } from 'mastodon/components/server_hero_image';
import { Skeleton } from 'mastodon/components/skeleton';

const mapStateToProps = state => ({
  server: state.getIn(['server', 'server']),
});

class ServerBanner extends PureComponent {

  static propTypes = {
    server: PropTypes.object,
    dispatch: PropTypes.func,
    intl: PropTypes.object,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchServer());
  }

  render () {
    const { server } = this.props;
    const isLoading = server.get('isLoading');

    return (
      <div className='server-banner'>

        <Link to='/about'>
          <ServerHeroImage blurhash={server.getIn(['thumbnail', 'blurhash'])} src={server.getIn(['thumbnail', 'url'])} className='server-banner__hero' />
        </Link>

        <div className='server-banner__description'>
          {isLoading ? (
            <>
              <Skeleton width='100%' />
              <br />
              <Skeleton width='100%' />
              <br />
              <Skeleton width='70%' />
            </>
          ) : server.get('description')}
        </div>

        <div className='server-banner__meta'>
          <div className='server-banner__meta__column'>
            <h4><FormattedMessage id='server_banner.administered_by' defaultMessage='Administered by:' /></h4>

            <Account id={server.getIn(['contact', 'account', 'id'])} size={36} minimal />
          </div>

          <div className='server-banner__meta__column'>
            <h4><FormattedMessage id='server_banner.server_stats' defaultMessage='Server stats:' /></h4>

            {isLoading ? (
              <>
                <strong className='server-banner__number'><Skeleton width='10ch' /></strong>
                <br />
                <span className='server-banner__number-label'><Skeleton width='5ch' /></span>
              </>
            ) : (
              <>
                <strong className='server-banner__number'><ShortNumber value={server.getIn(['usage', 'users', 'active_month'])} /></strong>
                <br />
                <span className='server-banner__number-label' title={intl.formatMessage(messages.aboutActiveUsers)}><FormattedMessage id='server_banner.active_users' defaultMessage='active users' /></span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(ServerBanner));
