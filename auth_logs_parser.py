from datetime import datetime, date
import argparse
import re
import json

# parse date from a line
def parse_date(line):
    string_date = re.search(r'^[a-zA-Z]{3}(\s+)[\d]{1,2}', line)
    return datetime.strptime(f"{date.today().year} {string_date.group(0)}", "%Y %b %d").date().strftime("%Y-%m-%d")

# parse user from a line
def parse_user(line):
    return re.search(r'for (\binvalid\suser\s)?(\w+)', line).group(2)

# parse getaddr from a line
def parse_addr(line):
    return re.search(r'for ([\w\.-]+)\s', line).group(1)

# parse ipv4 from a line containing results password text
def parse_fails_ipv4(line):
    return re.search(r'(\bfrom\s)((\d{1,3}\.){3}\d{1,3})', line).group(2)

def get_logs(file):
    failed = {}
    failed_p = "Failed password for"
    accepted = {}
    accepted_p = "Accepted password"
    for line in file:
        # filter by pattern
        if failed_p in line:
            ip = parse_fails_ipv4(line)
            if ip in failed:
                failed[ip]["attempts"] += 1
            else:
                date = parse_date(line)
                failed[ip] = {"attempts": 1, "date": date}
        elif accepted_p in line:
            ip = parse_fails_ipv4(line)
            d = dict(failed)
            del d[ip]
            if ip in accepted:
                accepted[ip]["attempts"] += 1
            else:
                date = parse_date(line)
                accepted[ip] = {"attempts": 1, "date": date}

    return accepted, failed

if __name__ == "__main__":
    logs = open("/var/log/auth.log", "r")
    accepted, failed = get_logs(logs)

    j = json.dumps(failed)
    print(j)

    #print("[FAILED]")
    #for ip in failed:
    #    if ip not in accepted and failed[ip]["attempts"] >= 5:
    #        print(ip)

    #print("\n[ACCEPTED]")
    #for ip in accepted:
    #    print(ip)
