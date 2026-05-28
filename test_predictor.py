import json

def format_result(res, user_rank):
    college = res['college']
    closing = res['closingRank']
    
    # Calculate chance based on difference
    diff = closing - user_rank
    if diff > 1000:
        chance = "Safe"
    elif diff >= 0:
        chance = "Good"
    else:
        chance = "Reach"
        
    return {
        "id": res['id'],
        "collegeName": college['name'],
        "slug": college['slug'],
        "location": f"{college['city']}, {college['state']}",
        "branch": res['branch'],
        "openingRank": res['openingRank'],
        "closingRank": closing,
        "fees": college.get('fees', {}).get('max', 0),
        "chanceLabel": chance
    }

print("Test predictor logic")
