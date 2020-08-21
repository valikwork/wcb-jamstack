import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

export default function Header(props) {
  const menu = useStaticQuery(graphql`
    query {
      wpgraphql {
        generalSettings {
          url
        }
        menu(id: "dGVybTo0NTUy") {
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
        themeGeneralSettings {
          optHeader {
            newHomepageLogo {
              mediaItemUrl
              altText
            }
          }
        }
      }
    }
  `)

  const { url } = menu.wpgraphql.generalSettings
  const { title } = props
  const {
    altText,
    mediaItemUrl,
  } = menu.wpgraphql.themeGeneralSettings.optHeader.newHomepageLogo

  // loop through the menu items and make the links relative
  const items = menu.wpgraphql.menu.menuItems.nodes.map(item => ({
    ...item,
    url: item.url.replace(url, ""),
  }))

  return (
    <header className="new_header" style={{ backgroundColor: "#223144" }}>
      <div className="row large-uncollapse medium-uncollapse small-collapse">
        <div className="large-3 columns">
          <div className="logo small-only-text-center">
            <Link to="/" className="home">
              <img src={mediaItemUrl} alt={altText} />
            </Link>
          </div>
        </div>
        <div className="large-7 columns">
          <nav
            className="top-bar"
            data-topbar=""
            role="navigation"
            data-options="{is_hover: false, mobile_show_parent_link: true}"
          >
            <ul className="title-area">
              <li className="name"></li>
              <li className="toggle-topbar menu-icon">
                <Link to="#" className="home">
                  <span>Menu</span>
                </Link>
              </li>
            </ul>
            <section className="top-bar-section">
              <div className="menu-new-header-menu-container">
                <ul id="menu-new-header-menu" className="menu">
                  {items.map(item => (
                    <li
                      key={item.id}
                      className={`menu-item ${
                        title === item.label ? "current-menu-item" : ""
                      }`}
                    >
                      <Link key={item.url} to={item.url}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </nav>
        </div>

        <div className="large-2 columns search-header">
          <form method="get" id="searchform" action={"/"}>
            <input
              type="text"
              name="s"
              id="s"
              placeholder="Search for broker..."
            />

            <input
              type="submit"
              className="prefix"
              name="submit"
              id="searchsubmit"
              value=""
            />
          </form>
        </div>
      </div>
    </header>
  )
}
