---
icon: fa-brands fa-python
category:
  - python
title: Python Spider
order: 24
tag:
- spider

---

以下是我的一些爬虫备份

## 东财

```py
import datetime
import requests
from loguru import logger
from bs4 import BeautifulSoup
from apscheduler.schedulers.blocking import BlockingScheduler

headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
    'Connection': 'keep-alive',
    'Referer': 'https://data.eastmoney.com/report/industry.jshtml',
    'Sec-Fetch-Dest': 'script',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 '
                  'Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Host': 'reportapi.eastmoney.com'
}

records = {
    'day': '',
    '个股研报': 0,
    '行业研报': 0,
    '策略报告': 0,
    '宏观研报': 0,
}


def report():
    return {
        'id': 0,
        'category': '',
        'industry_code': '',
        'industry_name': '',
        'stock_code': '',
        'stock_name': '',
        'publish_date': '',
        'title': '',
        'summary': '',
        'pdf_url': '',
        'author': '',
        'org_code': '',
        'org_name': '',
        'org_s_name': '',
        'em_rating_name': '',
        'url': '',
        'seed_url': '',
        # 个股行业名称
        'indv_indu_name': '',
        # 个股行业code
        'indv_indu_code': '',
    }


def fetch_eastmoney_report(url, category, begin, end, page_no):
    # 请求数据
    response = requests.get(url.format(begin, end, page_no), headers)
    report_list = []
    total_page = response.json()['TotalPage']
    hits = response.json()['hits']
    record = {
        category: hits
    }
    records.update(record)
    logger.info(
        '当前url：{},页数：{},当前页码：{},数量：{}'.format(url.format(begin, end, page_no), total_page, page_no, hits))
    for data in response.json()['data']:
        report_info = report()
        report_info['category'] = category
        report_info['title'] = data['title']
        report_info['seed_url'] = url
        # 个股code
        report_info['stock_code'] = data['stockCode']
        # 个股名称
        report_info['stock_name'] = data['stockName']
        # 个股code
        report_info['industry_code'] = data['industryCode']
        # 个股名称
        report_info['industry_name'] = data['industryName']
        # 二次跳转关键字段
        report_info['info_code'] = data['infoCode']
        # 当前评级
        report_info['em_rating_name'] = data['emRatingName']
        # 作者,作者有多个字段,researcher这个字段是作者的string形式
        report_info['author'] = data['researcher']
        # 机构代码
        report_info['org_code'] = data['orgCode']
        # 机构全称
        report_info['org_name'] = data['orgName']
        report_info['indv_indu_name'] = data['indvInduName']
        report_info['indv_indu_code'] = data['indvInduCode']
        # 机构简称
        report_info['org_s_name'] = data['orgSName']
        # 发布日期
        report_info['publish_date'] = data['publishDate']
        report_list.append(report_info)
    # 释放
    response.close()
    # 进入详情页面爬取信息
    for report_info in report_list:
        # 详情页面
        report_detail_uri = 'https://data.eastmoney.com/report/zw_industry.jshtml?infocode={}' \
            .format(report_info['info_code'])
        detail_html = requests.get(report_detail_uri, headers)

        soup = BeautifulSoup(detail_html.text, 'lxml')
        detail_html.close()
        pdf_url_a = soup.select('a.pdf-link')[0]
        summary = soup.select('div.ctx-content')[0]
        summary_text = summary.get_text()
        pdf_url = pdf_url_a.get('href')
        report_info['url'] = report_detail_uri
        report_info['pdf_url'] = pdf_url
        report_info['summary'] = summary_text
    if page_no < total_page:
        fetch_eastmoney_report(url, category, begin, end, page_no=page_no + 1)


def fetch_eastmoney_jg_report(url, category, begin, end, page_no):
    # 请求数据
    response = requests.get(url.format(begin, end, page_no), headers)
    report_list = []
    total_page = response.json()['TotalPage']
    hits = response.json()['hits']
    logger.info(
        '当前url：{},页数：{},当前页码：{},数量：{}'.format(url.format(begin, end, page_no), total_page, page_no, hits))
    for data in response.json()['data']:
        report_info = report()
        report_info['category'] = category
        report_info['title'] = data['title']
        report_info['seed_url'] = url

        # 二次跳转关键字段
        report_info['encode_url'] = data['encodeUrl']
        # 作者,作者有多个字段,researcher这个字段是作者的string形式
        report_info['author'] = data['researcher']
        # 机构代码
        report_info['org_code'] = data['orgCode']
        # 机构全称
        report_info['org_name'] = data['orgName']
        # 机构简称
        report_info['org_s_name'] = data['orgSName']
        # 发布日期
        report_info['publish_date'] = data['publishDate']

        report_list.append(report_info)
    response.close()
    # 进入详情页面爬取信息
    for report_info in report_list:
        # 详情页面
        report_detail_uri = 'https://data.eastmoney.com/report/zw_macresearch.jshtml?encodeUrl={}' \
            .format(report_info['encode_url'])
        detail_html = requests.get(report_detail_uri, headers)
        soup = BeautifulSoup(detail_html.text, 'lxml')
        detail_html.close()
        pdf_url_a = soup.select('a.pdf-link')[0]
        summary = soup.select('div.ctx-content')[0]
        pdf_url = pdf_url_a.get('href')
        summary_text = summary.get_text()
        if summary_text.rfind('风险提示'):
            summary_text = summary_text[0:summary_text.find('风险提示')]
        if summary_text.rfind('风险因素'):
            summary_text = summary_text[0:summary_text.rfind('风险因素')]
        report_info['url'] = report_detail_uri
        report_info['pdf_url'] = pdf_url
        report_info['summary'] = summary_text
    if page_no < total_page:
        fetch_eastmoney_jg_report(url, category, begin, end, page_no=page_no + 1)
    pass


def eastmoney_spider():
    now = datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
    today = datetime.datetime.today().strftime('%Y-%m-%d')
    logger.info("定时任务执行 at {}".format(now))
    report_uris = {
        # 行业研报,qType=1代表是行业研报
        '个股研报': 'https://reportapi.eastmoney.com/report/list?pageSize=100&beginTime={}&endTime={}&pageNo={}&qType=0',
        '行业研报': 'https://reportapi.eastmoney.com/report/list?pageSize=100&beginTime={}&endTime={}&pageNo={}&qType=1',
    }

    jg_uris = {
        '策略报告': 'https://reportapi.eastmoney.com/report/jg?pageSize=100&beginTime={}&endTime={}&pageNo={}&qType=2',
        '宏观研报': 'https://reportapi.eastmoney.com/report/jg?pageSize=100&beginTime={}&endTime={}&pageNo={}&qType=3',
    }

    for k, v in report_uris.items():
        fetch_eastmoney_report(v, k, today, today, 1)

    for k, v in jg_uris.items():
        fetch_eastmoney_jg_report(v, k, today, today, 1)


if __name__ == '__main__':
    eastmoney_spider()
    scheduler = BlockingScheduler()
    scheduler.add_job(eastmoney_spider, "cron", day='*', hour='*', minute='0')
    scheduler.start()

```
