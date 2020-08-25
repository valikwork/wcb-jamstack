import React, { useEffect, useRef } from "react"
import { graphql } from "gatsby"
import Parser from "html-react-parser"
import $ from "jquery"
import "jquery-match-height"
import "easy-pie-chart/dist/jquery.easypiechart"
import Layout from "../components/layout"
import BrokerList from "../components/BrokerList"
import { Helmet } from "react-helmet"
import BrokerTableSingleItem from "../components/BrokerTableSingleItem"
import CompareFrom from "../components/CompareFrom"
import withLocation from "../hoc/withLocation"
import { scoreAnimation } from "../functions/scoreAnimation"
import { avarageRatingCounter } from "../functions/avarageRatingCounter"
import { Link } from "@reach/router"

const queryString = require("query-string")

export const query = graphql`
  query($id: ID!) {
    wpgraphql {
      page(id: $id) {
        title
        content
        id
        isFrontPage
        seo {
          title
          metaDesc
          opengraphType
        }
        allPagesFields {
          alternativeTitle
          pageIcon {
            mediaItemUrl
          }
          videoPage
        }
        tmplComparisonPage {
          bottomText
          predefinedBrokersListSingle {
            ... on WPGraphQL_Broker123 {
              id
              title
            }
          }
          predefinedBrokersList {
            ... on WPGraphQL_Broker123 {
              uri
              title
              id
              databaseId
              cptBrokers {
                brokerRegion
                specialOffer
                affiliateLink
                minDeposit
                platformsList
                accountsList
                spreadsList
                methodsList
                takeMeToBrokerButtonNoteText
                ourScore
                allSpreadsPoints
                tableInfo
                platformRelation {
                  ... on WPGraphQL_Platform123 {
                    id
                    title
                    featuredImage {
                      node {
                        mediaItemUrl
                      }
                    }
                  }
                }
              }
              featuredImage {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
      brokers123(
        first: 10000
        where: { health: "good", orderby: { field: MENU_ORDER, order: ASC } }
      ) {
        nodes {
          title
          uri
          id
          featuredImage {
            node {
              mediaItemUrl
            }
          }
          cptBrokers {
            ratingCommFees
            ratingCustResearch
            ratingCustServ
            ratingEase
            ratingMobTrad
            ratingPlatfTools
            ourScore
            likesList
            affiliateLink
            tabButtonAlternativeText
          }
        }
      }
    }
  }
`

function ComparisonPageTemplate({ data, search }) {
  const firstUsr = search["first-usr"] ? JSON.parse(search["first-usr"]) : null
  console.log(firstUsr)
  const secUsr = search["sec-usr"] ? JSON.parse(search["sec-usr"]) : null
  console.log(secUsr)
  const firstBrokerRef = useRef(null)
  const secondBrokerRef = useRef(null)
  const topContentCol = useRef(null)

  const page = data.wpgraphql.page
  const seo = page.seo
  const templateFields = page.tmplComparisonPage

  useEffect(() => {
    if ($(".small-chart") != "") {
      $(".small-chart").easyPieChart({
        size: 84,
        barColor: "#2A79FF",
        trackColor: "#F6F7F8",
        scaleColor: false,
        lineWidth: 5,
        onStep: function (from, to, percent) {
          $(this.el).find(".percent").text(Math.round(percent))
        },
      })
    }
    if ($(".big-chart") != "") {
      $(".big-chart").easyPieChart({
        barColor: "#2A79FF",
        trackColor: "#F6F7F8",
        scaleColor: false,
        lineWidth: 8,
        onStep: function (from, to, percent) {
          $(this.el).find(".percent").text(Math.round(percent))
        },
      })
    }
    $(document).ready(function () {
      if (firstUsr) {
        var first = $(
          `form #first-usr option[id="1${firstUsr ? firstUsr.id : ""}"]`
        )
        var firstVal = first.val()
        $("form #first-usr").val(firstVal).trigger("change")
      }
      if (secUsr) {
        var sec = $(`form #sec-usr option[id="2${secUsr ? secUsr.id : ""}"]`)
        var secVal = sec.val()
        $("form #sec-usr").val(secVal).trigger("change")
      }

      $(".compare-btn").click(function () {
        var brokId = $(this).attr("data-id")
        $("#first-user").val(brokId)
        $("#compare-form-wrap").fadeIn("fast")
      })
      $("#popup-sec-usr").select2({
        placeholder: "Second Broker",
        allowClear: true,
      })
      $(firstBrokerRef.current).select2({
        placeholder: "First Broker",
        allowClear: true,
      })
      $(secondBrokerRef.current).select2({
        placeholder: "Second Broker",
        allowClear: true,
      })
      $(".top-content-col").matchHeight()
      $(".broker-col").matchHeight()

      $(".brok-info-wrap").each(function () {
        var list = $(this).find(".list-cont"),
          listItems = list.find("li").slice(0, 4)
        $(this).find(".advant-list").append(listItems)
      })
    })
  }, [])

  const TopContent = () => {
    return (
      <div class="top-content-compare">
        <div class="row top-content">
          <div
            class="large-5 medium-6 columns top-content-col"
            ref={topContentCol}
          >
            <div class="crumbs">
              <a href={"/"}>Home page</a> -&gt;
              <span>
                {page.allPagesFields.alternativeTitle
                  ? Parser(page.allPagesFields.alternativeTitle)
                  : Parser(page.title)}
              </span>
            </div>
            <article>
              <h1 class="page_title">
                {page.allPagesFields.pageIcon.mediaItemUrl ? (
                  <img
                    src={page.allPagesFields.pageIcon.mediaItemUrl}
                    alt="Title"
                  />
                ) : (
                  ""
                )}
                {page.allPagesFields.alternativeTitle
                  ? Parser(page.allPagesFields.alternativeTitle)
                  : Parser(page.title)}
              </h1>
              <div class="dot-sep">
                <span></span>
                <span></span>
                <span></span>
              </div>
              {Parser(page.content)}
            </article>
          </div>
          <div
            class="medium-6 columns text-center top-content-col"
            ref={topContentCol}
          >
            <div class="compare-filter-wrap">
              <h4>
                <img
                  src="https://www.wecomparebrokers.com/wp-content/themes/we-compare-brokers/images/filter-ico.svg"
                  alt="Filter"
                />
                Choose Brokers to Compare
              </h4>
              <form action="" method="get">
                <select id="first-usr" ref={firstBrokerRef} name="first-usr">
                  <option></option>
                  {data.wpgraphql.brokers123.nodes.map(broker => {
                    return (
                      <option
                        id={`1${broker.id}`}
                        value={JSON.stringify(broker)}
                      >
                        {broker.title}
                      </option>
                    )
                  })}
                </select>
                <select id="sec-usr" ref={secondBrokerRef} name="sec-usr">
                  <option></option>
                  {data.wpgraphql.brokers123.nodes.map(broker => {
                    return (
                      <option
                        id={`2${broker.id}`}
                        value={JSON.stringify(broker)}
                      >
                        {broker.title}
                      </option>
                    )
                  })}
                </select>
                <button class="btn blue" type="submit">
                  Compare
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const BrokerButtons = user => {
    console.log(user)
    if (
      user.user.cptBrokers.affiliateLink &&
      !user.user.cptBrokers.tabButtonAlternativeText
    ) {
      return (
        <Link
          class="btn small"
          to={user.user.cptBrokers.affiliateLink}
          target="_blank"
          rel="nofollow sponsored"
        >
          Go to Broker
        </Link>
      )
    } else if (
      user.user.cptBrokers.affiliateLink &&
      user.user.cptBrokers.tabButtonAlternativeText
    ) {
      return (
        <Link
          class="btn small"
          to={user.user.cptBrokers.affiliateLink}
          target="_blank"
          rel="nofollow sponsored"
        >
          {user.user.cptBrokers.tabButtonAlternativeText}
        </Link>
      )
    }
    return null
  }

  const FirstCompareColumn = () => {
    if (firstUsr) {
      let content = firstUsr.cptBrokers.likesList

      return (
        <div class="tabs-brok-card-wrap" data-mh="tabs-card">
          <div class="top-wrap">
            <div class="top-left top-cols" data-mh="top-cols">
              <img src={firstUsr.featuredImage.node.mediaItemUrl} />
            </div>
            <div class="top-right top-cols text-center" data-mh="top-cols">
              {scoreAnimation(firstUsr.cptBrokers.ourScore, "big-chart", true)}
            </div>
            <div class="brok-info-wrap">
              <p>What we like:</p>
              <ul class="advant-list"></ul>
              <div class="list-cont">{content ? Parser(content) : ""}</div>
            </div>
            <div class="rat-wrap">
              <span class="rating">
                <img
                  src="https://www.wecomparebrokers.com/wp-content/themes/we-compare-brokers/images/stars-mask.svg"
                  alt="Rating"
                />
                <span
                  class="rat-color"
                  style={{
                    width: `${avarageRatingCounter(firstUsr.cptBrokers) * 20}%`,
                  }}
                ></span>
              </span>
              {avarageRatingCounter(firstUsr.cptBrokers)}
            </div>
            <div class="btn-wrap">
              <BrokerButtons user={firstUsr} />
              <Link to={firstUsr.uri} class="btn small blue">
                Read Full Review
              </Link>
            </div>
          </div>
        </div>
      )
    } else return null
  }
  const SecondCompareColumn = () => {
    if (secUsr) {
      let content = secUsr.cptBrokers.likesList
      return (
        <div class="tabs-brok-card-wrap" data-mh="tabs-card">
          <div class="top-wrap">
            <div class="top-left top-cols" data-mh="top-cols">
              <img src={secUsr.featuredImage.node.mediaItemUrl} />
            </div>
            <div class="top-right top-cols text-center" data-mh="top-cols">
              {scoreAnimation(secUsr.cptBrokers.ourScore, "big-chart", true)}
            </div>
            <div class="brok-info-wrap">
              <p>What we like:</p>
              <ul class="advant-list"></ul>
              <div class="list-cont">{content ? Parser(content) : ""}</div>
            </div>
            <div class="rat-wrap">
              <span class="rating">
                <img
                  src="https://www.wecomparebrokers.com/wp-content/themes/we-compare-brokers/images/stars-mask.svg"
                  alt="Rating"
                />
                <span
                  class="rat-color"
                  style={{
                    width: `${avarageRatingCounter(secUsr.cptBrokers) * 20}%`,
                  }}
                ></span>
              </span>
              {avarageRatingCounter(secUsr.cptBrokers)}
            </div>
            <div class="btn-wrap">
              <BrokerButtons user={secUsr} />
              <Link to={secUsr.uri} class="btn small blue">
                Read Full Review
              </Link>
            </div>
          </div>
        </div>
      )
    } else return null
  }

  const CompareColumns = () => {
    return (
      <div class="row compare-cols">
        <div class="medium-6 columns">
          <FirstCompareColumn />
        </div>
        <div class="medium-6 columns">
          <SecondCompareColumn />
        </div>
      </div>
    )
  }

  const BottomText = () => {
    return (
      <div class="choose-wrap bot-text">
        <div class="row">
          <div class="medium-10 columns small-centered">
            {Parser(templateFields.bottomText ? templateFields.bottomText : "")}
          </div>
        </div>
      </div>
    )
  }

  const pageInfo = {
    isFrontPage: page.isFrontPage,
    title: page.title,
  }

  return (
    <Layout pageInfo={pageInfo}>
      <Helmet
        htmlAttributes={{ lang: "en", amp: undefined }}
        title={seo.title}
        meta={[
          { name: "description", content: seo.metaDesc },
          { property: "og:type", content: seo.opengraphType },
        ]}
      />
      <CompareFrom />
      <TopContent />
      <CompareColumns />
      <div class="row brokers-list">
        <div class="small-12 columns">
          {templateFields.predefinedBrokersList.map(broker => {
            return <BrokerTableSingleItem key={broker.id} brokerInfo={broker} />
          })}
        </div>
      </div>
      <BottomText />
    </Layout>
  )
}

export default withLocation(ComparisonPageTemplate)
