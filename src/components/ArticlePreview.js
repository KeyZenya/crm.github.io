import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';


@inject('articlesStore')
@observer
export default class ArticlePreview extends React.Component {

  handleClickFavorite = ev => {
    ev.preventDefault();
    const { articlesStore, article } = this.props;
    if (article.favorited) {
      articlesStore.unmakeFavorite(article.slug);
    } else {
      articlesStore.makeFavorite(article.slug);
    }
  };

  render() {
    const { article } = this.props;
    const favoriteButtonClass = article.favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS;

    return (
      <div className="article-preview">
        <div className="article-meta">

          <div className="info">
            <span className="date">
            date
          </span>
          </div>

          <div className="pull-xs-right">
            <button className={favoriteButtonClass} onClick={this.handleClickFavorite}>
              <i className="ion-heart" />
            </button>
          </div>
        </div>

        {/*<Link to={`/article/${article.slug}`} className="preview-link">*/}
          {/*<h1>asd</h1>*/}
          {/*<p>asd</p>*/}
          {/*<span>Read more...</span>*/}
        {/*</Link>*/}
      </div>
    );
  }
}
