
import os
from typing import List
from datetime import datetime, timedelta
import json
import requests


apikey = os.environ["NHK_API_KEY"]


class NHKApi():
    area = "130"
    genre = "1001"
    base_url = "http://api.nhk.or.jp/v2/pg/genre"
    # NHK総合 g1
    # BS プレミアム s3
    @classmethod
    def url(cls, service: str, date_str: str) -> str:
        url = f"{cls.base_url}/{cls.area}/{service}/{cls.genre}/{date_str}.json"
        return url


def get_g1_data(date_str: str):
    url = NHKApi.url("g1", date_str)
    response = requests.get(url, params={"key": apikey})
    if response.status_code == 200:
        return response.json()
    else:
        print()


def get_s3_data(date_str: str):
    url = NHKApi.url("s3", date_str)
    response = requests.get(url, params={"key": apikey})
    if response.status_code == 200:
        return response.json()
    else:
        print()


def check_is_nekoaruki(service: str, program: dict) -> bool:
    is_nekoaruki = False
    try:
        title = program["title"]
        if "ネコ歩き" in title:
            is_nekoaruki = True
    except KeyError:
        print("data type is invalided")
    return is_nekoaruki


def filter_nekoaruki(service: str, data: dict) -> List[dict]:
    filtered_programs: list = []
    if data and data.get("list"):
        try:
            programs = data["list"][service]
            filtered_programs = [i for i in programs if check_is_nekoaruki(service, i)]
        except KeyError:
            print("data type is invalided")
    return filtered_programs


def get_days() -> List[str]:
    days_ls = []
    dt_format = "%Y-%m-%d"
    search_day = 6
    current = datetime.now()

    for i in range(search_day):
        days_ls.append((current + timedelta(days=i)).strftime(dt_format))
    return days_ls


def get_nekoaruki() -> List[dict]:
    days = get_days()
    programs: list = []
    for day in days:
        g1_data = filter_nekoaruki("g1", get_g1_data(day))
        s3_data = filter_nekoaruki("s3", get_s3_data(day))
        one_day_data = g1_data + s3_data
        if one_day_data:
            for data in one_day_data:
                programs.append(data)
    return programs


class TimeTreeAPI():
    url = "https://timetreeapis.com"
    api_key = os.environ["TIMETREE_API_KEY"]
    headers = {'Authorization': f'Bearer {api_key}',
               "Accept": "application/vnd.timetree.v1+json",
               "Content-Type": "application/json"}


def get_calendar() -> str:
    response = requests.get(TimeTreeAPI.url + "/calendars", headers=TimeTreeAPI.headers)
    if response.status_code == 200:
        data = response.json()
        calendars = data["data"]
        for calendar in calendars:
            if calendar["attributes"]["order"] == 0:
                return calendar
            else:
                pass
    else:
        print(response.content)
        return response.text


def check_upcoming_events(calendar_id: str):
    response = requests.get(TimeTreeAPI.url + f"/calendars/{calendar_id}/upcoming_events",
                            headers=TimeTreeAPI.headers,
                            params={"days": 7})
    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(response.content)


def convert_to_timetree_style(data: dict, calendar_id: str):
    timetree_dict = {
        "data": {
            "attributes": {
                "title": data["title"],
                "category": "schedule",
                "all_day": False,
                "start_at": data["start_time"],
                "end_at": data["end_time"],
                "description": data["title"] + "\n" + data["content"],
                "location": data["service"]["name"],
                "url": "https://www4.nhk.or.jp/nekoaruki/"
            },
            "relationships": {
                "label": {
                    "data": {
                        "id": f"{calendar_id},1",
                        "type": "label"
                    }
                }
            }
        }
    }
    return timetree_dict


def add_event(data: dict, calendar_id: str):
    json_data = json.dumps(data)
    response = requests.post(TimeTreeAPI.url + f"/calendars/{calendar_id}/events",
                             headers=TimeTreeAPI.headers, data=json_data)
    if response.status_code == 201:
        print(response.json())
        return True
    else:
        print(response.json())


def convert_all(programs: dict, cal_id: str):
    events: list = []
    for program in programs:
        events.append(convert_to_timetree_style(program, cal_id))
    return events


def post_events(data_ls: List[dict], calendar_id: str, registered: List[dict]):
    add_events: list = []
    title_ls = [i["title"] for i in registered]

    for data in data_ls:
        if data["data"]["attributes"]["title"] in title_ls:
            continue
        else:
            add_events.append(data)
    if add_events:
        for event in add_events:
            add_event(event, calendar_id)
            print("add!")


def extract_registered_data(data_ls: List[dict]):
    filtered_registered_events = filter(lambda x: "ネコ歩き" in x["attributes"]["title"], data_ls)
    extracted: list = []
    for program in filtered_registered_events:
        extracted.append({"title": program["attributes"]["title"],
                          "start": program["attributes"]["start_at"]})
    return extracted


def main():
    # get programs
    nekoaruki_programs = get_nekoaruki()
    # get cal_id
    cal_id = get_calendar()["id"]
    # get upcoming events
    registered_events = check_upcoming_events(cal_id)["data"]
    # filter upcoming events
    extracted = extract_registered_data(registered_events)
    data_ls = convert_all(nekoaruki_programs, cal_id)
    post_events(data_ls, cal_id, extracted)


# def main(request):
#     if request.get_json()["key"] == "nekoaruki":
#         # get programs
#         nekoaruki_programs = get_nekoaruki()
#         # get cal_id
#         cal_id = get_calendar()["id"]
#         # get upcoming events
#         registered_events = check_upcoming_events(cal_id)["data"]
#         # filter upcoming events
#         extracted = extract_registered_data(registered_events)
#         data_ls = convert_all(nekoaruki_programs, cal_id)
#         post_events(data_ls, cal_id, extracted)
#         return "success!"
#     else:
#         return "failed..."


if __name__ == "__main__":
    main()
